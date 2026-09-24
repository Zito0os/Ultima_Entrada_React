import { crearMaterial } from './materiales'

// Pelota reglamentaria: 7.3 cm de diametro y 108 puntadas dobles. Medidas en cm.
export const PELOTA = {
  radio: 3.66,
  puntadas: 108,
  // Curva de la costura: con a + b = 1 cae sobre la esfera; b = a / 3 es la de una pelota real
  curvaA: 0.75,
  curvaB: 0.25,
  // Grueso del hilo en cm
  hilo: 0.12,
  // Cada puntada, en fracciones del radio: donde empieza, donde acaba y cuanto se echa atras
  puntadaDentro: 0.03,
  puntadaFuera: 0.12,
  puntadaAtras: 0.045,
}

const CUERO = { color: 0xD9C9AB, roughness: 0.6, metalness: 0 }
const SURCO = { color: 0x9C8C70, roughness: 0.8, metalness: 0 }
const HILO = { color: 0x750203, roughness: 0.7, metalness: 0 }

function curva(t, destino) {
  const a = PELOTA.curvaA
  const b = PELOTA.curvaB
  return destino.set(
    a * Math.cos(t) + b * Math.cos(3 * t),
    2 * Math.sqrt(a * b) * Math.sin(2 * t),
    a * Math.sin(t) - b * Math.sin(3 * t),
  ).normalize()
}

// Parametros de la curva repartidos por longitud, para que las puntadas queden parejas
function repartir(THREE, cuantas) {
  const muestras = 2000
  const puntos = []
  const largos = [0]
  for (let i = 0; i <= muestras; i += 1) {
    puntos.push(curva((i / muestras) * Math.PI * 2, new THREE.Vector3()))
    if (i > 0) {
      largos.push(largos[i - 1] + puntos[i].distanceTo(puntos[i - 1]))
    }
  }
  const total = largos[muestras]
  const parametros = []
  let j = 0
  for (let k = 0; k < cuantas; k += 1) {
    const meta = (k / cuantas) * total
    while (largos[j + 1] < meta) {
      j += 1
    }
    parametros.push(((j + (meta - largos[j]) / (largos[j + 1] - largos[j])) / muestras) * Math.PI * 2)
  }
  return parametros
}

// Grano del cuero: ruido fino que solo mueve la luz, no el color
function grano(THREE) {
  const lienzo = document.createElement('canvas')
  lienzo.width = 512
  lienzo.height = 256
  const ctx = lienzo.getContext('2d')
  const imagen = ctx.createImageData(lienzo.width, lienzo.height)
  for (let i = 0; i < imagen.data.length; i += 4) {
    const v = 110 + Math.random() * 60
    imagen.data[i] = v
    imagen.data[i + 1] = v
    imagen.data[i + 2] = v
    imagen.data[i + 3] = 255
  }
  ctx.putImageData(imagen, 0, 0)
  const textura = new THREE.CanvasTexture(lienzo)
  textura.wrapS = THREE.RepeatWrapping
  textura.wrapT = THREE.RepeatWrapping
  textura.repeat.set(3, 2)
  return textura
}

export function crearPelota(THREE) {
  const R = PELOTA.radio
  const grupo = new THREE.Group()
  grupo.name = 'pelota'

  const cuero = crearMaterial(THREE, { ...CUERO, bumpMap: grano(THREE), bumpScale: 0.004 })
  const esfera = new THREE.Mesh(new THREE.SphereGeometry(R, 96, 64), cuero)
  grupo.add(esfera)

  // El surco donde se juntan las dos piezas de cuero
  const trazo = []
  for (let i = 0; i < 400; i += 1) {
    trazo.push(curva((i / 400) * Math.PI * 2, new THREE.Vector3()).multiplyScalar(R))
  }
  const surco = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(trazo, true), 400, R * 0.012, 6, true),
    crearMaterial(THREE, SURCO),
  )
  grupo.add(surco)

  // Cada puntada doble son dos hilos en V que abren hacia atras
  const largo = Math.hypot(PELOTA.puntadaFuera - PELOTA.puntadaDentro, PELOTA.puntadaAtras) * R
  const forma = new THREE.CapsuleGeometry(PELOTA.hilo / 2, largo, 3, 8)
  const hilos = new THREE.InstancedMesh(forma, crearMaterial(THREE, HILO), PELOTA.puntadas * 2)
  const p = new THREE.Vector3()
  const antes = new THREE.Vector3()
  const despues = new THREE.Vector3()
  const avance = new THREE.Vector3()
  const lado = new THREE.Vector3()
  const dentro = new THREE.Vector3()
  const fuera = new THREE.Vector3()
  const eje = new THREE.Vector3(0, 1, 0)
  const giro = new THREE.Quaternion()
  const matriz = new THREE.Matrix4()
  const escala = new THREE.Vector3(1, 1, 1)
  let n = 0
  for (const t of repartir(THREE, PELOTA.puntadas)) {
    curva(t, p)
    avance.subVectors(curva(t + 0.001, despues), curva(t - 0.001, antes)).normalize()
    lado.crossVectors(p, avance).normalize()
    for (const s of [-1, 1]) {
      dentro.copy(p).addScaledVector(lado, s * PELOTA.puntadaDentro).normalize()
      fuera.copy(p).addScaledVector(lado, s * PELOTA.puntadaFuera).addScaledVector(avance, -PELOTA.puntadaAtras).normalize()
      giro.setFromUnitVectors(eje, antes.subVectors(fuera, dentro).normalize())
      despues.addVectors(dentro, fuera).normalize().multiplyScalar(R + PELOTA.hilo * 0.2)
      hilos.setMatrixAt(n, matriz.compose(despues, giro, escala))
      n += 1
    }
  }
  grupo.add(hilos)

  grupo.traverse((malla) => {
    malla.castShadow = true
    malla.receiveShadow = true
  })
  return grupo
}
