import { ORO, ORO_CEPILLADO, ORO_VIEJO, crearMaterial } from './materiales'

// Guante de cuadro de 11.5 pulgadas (29 cm del talon a la punta del indice), de mano
// izquierda visto desde la bolsa: dedos hacia +y, bolsa hacia +z y pulgar en +x. Medidas en cm.
export const GUANTE = {
  // hueco es cuanto se hunde el centro de la bolsa, en cm
  palma: { cx: -1.2, cy: 8, rx: 9.2, ry: 8, frente: 2.4, fondo: 3, hueco: 1.9 },
  // Los lados y el talon se vienen al frente para cerrar la bolsa
  copa: 0.05,
  talon: 0.02,
  // Los dedos nacen debajo de la bolsa, asi su base redonda no se asoma
  baseDedos: 6.5,
  fondoDedos: -1.1,
  grueso: 2.8,
  // Anchos y juntos, como los dedales de un guante; solo se separan en las puntas
  dedos: [
    { x: 5, largo: 20, angulo: 0.07, ancho: 4.7 },
    { x: 0.7, largo: 21.3, angulo: 0.02, ancho: 4.7 },
    { x: -3.6, largo: 20.5, angulo: -0.03, ancho: 4.6 },
    { x: -7.9, largo: 18.7, angulo: -0.09, ancho: 4.4 },
  ],
  pulgar: { puntos: [[5.8, 3, 0], [8.6, 8.5, 0.6], [10.4, 14.5, 1.2], [11, 20, 1.6]], ancho: 4.4, grueso: 2.8 },
  red: { hundido: 2.2, cruces: 4 },
  // Piel entre dedos vecinos, en fraccion del largo: arriba de esto quedan libres
  union: [0.2, 0.75],
  cordon: 0.28,
  ribete: 1,
  pespunte: { paso: 0.55, largo: 0.35, grueso: 0.07 },
  correa: { y: 3.2, ancho: 3, grueso: 0.9 },
}

function doblar(punto) {
  const { palma, copa, talon } = GUANTE
  punto.z += copa * (punto.x - palma.cx) ** 2 + talon * Math.max(0, 6 - punto.y) ** 2
  return punto
}

// Tubo de seccion ovalada que cierra redondo en los dos extremos. `superficie`
// da un punto de su piel para colocar cordones y pespuntes encima.
function barrido(THREE, puntos, { ancho, grueso, frente, redondeo, afinar = 0.12 }) {
  const curva = new THREE.CatmullRomCurve3(puntos, false, 'centripetal')
  const r = Math.min(0.5, redondeo / curva.getLength())

  const superficie = (t, angulo, extra = 0) => {
    const centro = curva.getPointAt(t)
    const avance = curva.getTangentAt(t)
    const grosor = frente.clone().addScaledVector(avance, -frente.dot(avance)).normalize()
    const lado = new THREE.Vector3().crossVectors(avance, grosor)
    const d = Math.min(t, 1 - t)
    const s = (d < r ? Math.sqrt(1 - ((r - d) / r) ** 2) : 1) * (1 - afinar * t)
    return centro
      .addScaledVector(lado, Math.cos(angulo) * ((ancho / 2) * s + extra))
      .addScaledVector(grosor, Math.sin(angulo) * ((grueso / 2) * s + extra))
  }

  // Anillos mas juntos en las puntas, que es donde se curva
  const pasos = 64
  const lados = 24
  const posiciones = []
  for (let i = 0; i <= pasos; i += 1) {
    const t = 0.5 - 0.5 * Math.cos((Math.PI * i) / pasos)
    for (let j = 0; j < lados; j += 1) {
      posiciones.push(...superficie(t, (Math.PI * 2 * j) / lados).toArray())
    }
  }
  const indices = []
  for (let i = 0; i < pasos; i += 1) {
    for (let j = 0; j < lados; j += 1) {
      const a = i * lados + j
      const b = i * lados + ((j + 1) % lados)
      indices.push(a, a + lados, b, b, a + lados, b + lados)
    }
  }
  const geometria = new THREE.BufferGeometry()
  geometria.setAttribute('position', new THREE.Float32BufferAttribute(posiciones, 3))
  geometria.setIndex(indices)
  geometria.computeVertexNormals()
  return { geometria, superficie }
}

// Superficie de columnas x filas; punto(s, v) recibe los dos entre 0 y 1
function malla(THREE, columnas, filas, punto) {
  const posiciones = []
  const indices = []
  for (let i = 0; i <= filas; i += 1) {
    for (let j = 0; j <= columnas; j += 1) {
      posiciones.push(...punto(j / columnas, i / filas).toArray())
      if (i < filas && j < columnas) {
        const a = i * (columnas + 1) + j
        indices.push(a, a + 1, a + columnas + 1, a + 1, a + columnas + 2, a + columnas + 1)
      }
    }
  }
  const geometria = new THREE.BufferGeometry()
  geometria.setAttribute('position', new THREE.Float32BufferAttribute(posiciones, 3))
  geometria.setIndex(indices)
  geometria.computeVertexNormals()
  return geometria
}

// Palma: un ovalo con el frente hundido en forma de bolsa y el dorso abombado
function crearPalma(THREE) {
  const { cx, cy, rx, ry, frente, fondo, hueco } = GUANTE.palma
  const geometria = new THREE.SphereGeometry(1, 72, 56)
  const posicion = geometria.attributes.position
  const punto = new THREE.Vector3()
  for (let i = 0; i < posicion.count; i += 1) {
    punto.fromBufferAttribute(posicion, i)
    const { x, y, z } = punto
    punto.set(
      cx + x * rx * (1 + 0.12 * y),
      cy + y * ry,
      // La bolsa resta un hundimiento suave que se apaga hacia la orilla
      z > 0 ? frente * z - hueco * (z * z) ** 2 : fondo * z,
    )
    doblar(punto)
    posicion.setXYZ(i, punto.x, punto.y, punto.z)
  }
  geometria.computeVertexNormals()
  return geometria
}

// Punto del dorso de la palma, para montar la correa encima
function dorso(THREE, x, y, afuera) {
  const { cx, cy, rx, ry, fondo } = GUANTE.palma
  const v = (y - cy) / ry
  const u = (x - cx) / (rx * (1 + 0.12 * v))
  const z = -fondo * Math.sqrt(Math.max(0, 1 - u * u - v * v)) - afuera
  return doblar(new THREE.Vector3(x, y, z))
}

function puntosDedo(THREE, { x, largo, angulo }) {
  return [0, 0.35, 0.7, 1].map((t) => doblar(new THREE.Vector3(
    x + Math.sin(angulo) * largo * t,
    GUANTE.baseDedos + Math.cos(angulo) * largo * t,
    GUANTE.fondoDedos + 2 * t ** 1.5,
  )))
}

export function crearGuante(THREE) {
  const grupo = new THREE.Group()
  grupo.name = 'guante'
  const oro = crearMaterial(THREE, ORO)
  const cepillado = crearMaterial(THREE, ORO_CEPILLADO)
  const viejo = crearMaterial(THREE, ORO_VIEJO)
  const poner = (geometria, material) => {
    const malla = new THREE.Mesh(geometria, material)
    malla.castShadow = true
    malla.receiveShadow = true
    grupo.add(malla)
    return malla
  }
  const { cordon } = GUANTE
  const lazo = (puntos, radio = cordon) => poner(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(puntos), puntos.length * 12, radio, 8), viejo)

  poner(crearPalma(THREE), oro)

  const alFrente = new THREE.Vector3(0, 0, 1)
  const dedos = GUANTE.dedos.map((dedo) => {
    const tubo = barrido(THREE, puntosDedo(THREE, dedo), { ancho: dedo.ancho, grueso: GUANTE.grueso, frente: alFrente, redondeo: dedo.ancho / 2, afinar: 0 })
    poner(tubo.geometria, oro)
    return tubo
  })

  // Une cada dedo con el siguiente para que se lean como una sola pieza de piel
  const [desde, hasta] = GUANTE.union
  const oroDoble = crearMaterial(THREE, { ...ORO, side: THREE.DoubleSide })
  dedos.slice(0, -1).forEach((dedo, i) => {
    const vecino = dedos[i + 1]
    poner(malla(THREE, 6, 20, (s, v) => {
      const t = desde + (hasta - desde) * v
      const punto = dedo.superficie(t, Math.PI, -0.1).lerp(vecino.superficie(t, 0, -0.1), s)
      punto.z -= 0.35 * Math.sin(Math.PI * s)
      return punto
    }), oroDoble)
  })

  const { pulgar } = GUANTE
  const tuboPulgar = barrido(THREE, pulgar.puntos.map((p) => doblar(new THREE.Vector3(...p))), {
    ancho: pulgar.ancho,
    grueso: pulgar.grueso,
    frente: new THREE.Vector3(-0.5, 0, 0.85).normalize(),
    redondeo: pulgar.ancho / 2,
  })
  poner(tuboPulgar.geometria, oro)

  // Red: una tela entre el costado del indice y el del pulgar, hundida hacia atras
  const indice = dedos[0]
  const orillaIndice = (v) => indice.superficie(0.2 + 0.68 * v, 0)
  const orillaPulgar = (v) => tuboPulgar.superficie(0.3 + 0.65 * v, Math.PI)
  const puntoRed = (s, v, extra = 0) => {
    const punto = orillaIndice(v).lerp(orillaPulgar(v), s)
    punto.z += extra - GUANTE.red.hundido * Math.sin(Math.PI * s) * (0.3 + 0.7 * v)
    return punto
  }
  poner(malla(THREE, 14, 24, (s, v) => puntoRed(s, v)), crearMaterial(THREE, { ...ORO_CEPILLADO, side: THREE.DoubleSide }))

  // Cordones de la red en X, como una red de canasta, y uno cerrando arriba
  const tramo = (desde, hasta, n = 10) => Array.from({ length: n + 1 }, (_, k) => {
    const f = k / n
    return puntoRed(desde[0] + (hasta[0] - desde[0]) * f, desde[1] + (hasta[1] - desde[1]) * f, cordon)
  })
  const { cruces } = GUANTE.red
  for (let k = 0; k < cruces; k += 1) {
    const v0 = k / cruces
    const v1 = (k + 1) / cruces
    lazo(tramo([0, v0], [1, v1]))
    lazo(tramo([1, v0], [0, v1]))
  }
  lazo(tramo([0, 1], [1, 1]), cordon * 1.2)

  // El cordon que corre por las puntas y une los cuatro dedos
  const puntas = dedos.flatMap((dedo) => [0, 0.25, 0.5, 0.75, 1].map((f) => dedo.superficie(0.9, Math.PI * f, cordon)))
  lazo(puntas)

  // Costuras en zigzag por la orilla del menique y la del pulgar
  const zigzag = (tubo, angulo, desde, hasta) => lazo(Array.from({ length: 13 }, (_, k) => (
    tubo.superficie(desde + ((hasta - desde) * k) / 12, angulo + (k % 2 ? 0.45 : -0.45), cordon)
  )))
  zigzag(dedos[3], Math.PI, 0.12, 0.85)
  zigzag(tuboPulgar, 0, 0.15, 0.85)

  // Ribete: el borde enrollado que rodea el talon
  const { cx, cy, rx, ry } = GUANTE.palma
  const borde = []
  for (let grados = 150; grados <= 340; grados += 10) {
    const a = (grados * Math.PI) / 180
    borde.push(doblar(new THREE.Vector3(cx + Math.cos(a) * rx * (1 + 0.12 * Math.sin(a)), cy + Math.sin(a) * ry, 0)))
  }
  poner(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(borde), 120, GUANTE.ribete, 12), cepillado)

  // Pespuntes a los dos lados del frente de cada dedo y del pulgar
  const { paso, largo, grueso } = GUANTE.pespunte
  const lineas = [
    ...dedos.flatMap((dedo, i) => [[dedo, GUANTE.dedos[i].largo], [dedo, GUANTE.dedos[i].largo]]),
    [tuboPulgar, 18], [tuboPulgar, 18],
  ]
  const puntadas = []
  lineas.forEach(([tubo, medida], i) => {
    const angulo = Math.PI / 2 + (i % 2 ? 0.75 : -0.75)
    const cuantas = Math.floor((medida * 0.72) / paso)
    for (let k = 0; k < cuantas; k += 1) {
      const t = 0.1 + (0.72 * k) / cuantas
      puntadas.push([tubo.superficie(t, angulo, 0.03), tubo.superficie(t + 0.01, angulo, 0.03)])
    }
  })
  const hilos = new THREE.InstancedMesh(new THREE.CapsuleGeometry(grueso, largo, 2, 6), viejo, puntadas.length)
  const eje = new THREE.Vector3(0, 1, 0)
  const giro = new THREE.Quaternion()
  const matriz = new THREE.Matrix4()
  const escala = new THREE.Vector3(1, 1, 1)
  puntadas.forEach(([a, b], k) => {
    giro.setFromUnitVectors(eje, b.clone().sub(a).normalize())
    hilos.setMatrixAt(k, matriz.compose(a, giro, escala))
  })
  grupo.add(hilos)

  // Correa del dorso con su parche ovalado
  const { correa } = GUANTE
  const trazoCorrea = Array.from({ length: 9 }, (_, k) => dorso(THREE, -8.5 + (14 * k) / 8, correa.y, correa.grueso / 2 - 0.15))
  const tuboCorrea = barrido(THREE, trazoCorrea, { ancho: correa.ancho, grueso: correa.grueso, frente: alFrente, redondeo: 1.2, afinar: 0 })
  poner(tuboCorrea.geometria, cepillado)
  const centro = tuboCorrea.superficie(0.55, -Math.PI / 2, 0.1)
  const parche = poner(new THREE.CylinderGeometry(1.5, 1.5, 0.35, 40), oro)
  parche.scale.set(1.45, 1, 1)
  parche.rotation.x = Math.PI / 2
  parche.position.copy(centro)
  const marco = poner(new THREE.TorusGeometry(1.5, 0.14, 8, 40), viejo)
  marco.scale.set(1.45, 1, 1)
  marco.position.copy(centro).add(new THREE.Vector3(0, 0, -0.18))

  grupo.traverse((malla) => {
    malla.castShadow = true
    malla.receiveShadow = true
  })
  return grupo
}

// Modelo low poly hecho en Blender (contexto/blender/guante.py), en cm y con los mismos ejes
const RUTA_GLB = `${import.meta.env.BASE_URL}modelos/guante.glb`
// Fondo de la bolsa del modelo y su normal, medidos en Blender
export const BOLSA = { punto: [2.5, 12.5, 0.48], normal: [0.14, -0.15, 0.98] }
const MATERIALES_GLB = { Oro: ORO, OroViejo: ORO_VIEJO }

// El guante de Blender; si no carga, el hecho en codigo, que no trae userData.bolsa
export async function cargarGuante(THREE) {
  try {
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
    const { scene } = await new GLTFLoader().loadAsync(RUTA_GLB)
    const materiales = {}
    scene.traverse((malla) => {
      if (!malla.isMesh) {
        return
      }
      const nombre = malla.material.name
      materiales[nombre] ??= crearMaterial(THREE, MATERIALES_GLB[nombre] ?? ORO)
      malla.material = materiales[nombre]
      malla.castShadow = true
      malla.receiveShadow = true
    })
    scene.name = 'guante'
    scene.userData.bolsa = {
      punto: new THREE.Vector3(...BOLSA.punto),
      normal: new THREE.Vector3(...BOLSA.normal).normalize(),
    }
    return scene
  } catch {
    return crearGuante(THREE)
  }
}
