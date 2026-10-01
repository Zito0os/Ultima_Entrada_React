// Bateador animado frente al escudo en AR. Las medidas van en proporcion al escudo.
const RUTA = 'modelos/Modelo_base_anim.glb'
const ALTURA = 1.15
// Hacia la derecha de la pantalla, altura de los pies y hacia la camara
const POSICION = [0.32, -0.6, 0.4]
// Giro extra sobre el que mira a la camara, para verlo de tres cuartos
const GIRO = 0.6

// Aparicion: un corte que sube de los pies a la cabeza con borde dorado
const DURACION_APARICION = 1.4
const COLOR_APARICION = 0xf5c64b
// El bate levantado pasa de la cabeza: el corte sube un poco mas que el jugador
const ALTO_DEL_CORTE = 1.45

// Bate y agarre, los mismos de JuegoFinal.jsx (Leo). Largo y radios en proporcion al jugador.
const BATE_LARGO = 0.46
const BATE_RADIO_SUPERIOR = 0.034
const BATE_RADIO_INFERIOR = 0.0055
const BATE_PUNTO_AGARRE = 0.14
const BATE_INVERTIR = true
const BATE_AJUSTE_POSICION = [0, 15, 0]

// Hit dura 2 s a 30 cuadros: el seguimiento termina en el 41 y despues corre a primera.
// subclip no incluye el cuadro final, por eso va 42
const FIN_DEL_SWING = 42

// El modelo trae tres esqueletos y Hit y Strike apuntan a los copiados (_1, _2):
// se mandan al esqueleto que se ve, como en el minijuego
function alRigVisible(THREE, clip) {
  const pistas = clip.tracks.map((pista) => {
    const copia = pista.clone()
    copia.name = copia.name.replace(/(mixamorig[^.]+)_[12](?=\.)/g, '$1')
    return copia
  })
  return new THREE.AnimationClip(clip.name, clip.duration, pistas)
}

// Perfil torneado de largo 1: perilla, mango delgado y barril
function crearBate(THREE) {
  const sup = BATE_RADIO_SUPERIOR
  const inf = BATE_RADIO_INFERIOR
  const perfil = [[0, 0], [inf * 1.5, 0], [inf * 1.65, 0.02], [inf * 1.1, 0.045], [inf, 0.12]]
  for (let i = 1; i <= 8; i += 1) {
    const t = i / 8
    const suave = t * t * (3 - 2 * t)
    perfil.push([inf + (sup - inf) * suave, 0.12 + 0.82 * t])
  }
  perfil.push([sup * 0.85, 0.995], [0, 1])
  const geometria = new THREE.LatheGeometry(perfil.map(([r, y]) => new THREE.Vector2(r, y)), 20)
  geometria.translate(0, -BATE_PUNTO_AGARRE, 0)
  const bate = new THREE.Mesh(geometria, new THREE.MeshStandardMaterial({ color: 0xc8934f, roughness: 0.65, metalness: 0.05 }))
  bate.frustumCulled = false
  return bate
}

// Eje del bate = linea de los nudillos (menique a indice), en el espacio del hueso de la mano
function ponerBate(THREE, raiz, largo) {
  raiz.updateMatrixWorld(true)
  let mano = null
  raiz.traverse((parte) => {
    if (!mano && parte.isSkinnedMesh) {
      mano = parte.skeleton.bones.find((hueso) => /^mixamorigRightHand$/.test(hueso.name))
    }
  })
  if (!mano) {
    return
  }
  const dedo = (nombre) => mano.children.find((hijo) => hijo.name.includes(nombre))
  const nudillos = ['RightHandIndex1', 'RightHandMiddle1', 'RightHandRing1', 'RightHandPinky1'].map(dedo).filter(Boolean)
  const eje = new THREE.Vector3(-1, 0, 1)
  const centro = new THREE.Vector3()
  const indice = dedo('RightHandIndex1')
  const menique = dedo('RightHandPinky1')
  if (indice && menique) {
    eje.copy(indice.position).sub(menique.position).normalize()
    nudillos.forEach((nudillo) => centro.add(nudillo.position))
    centro.divideScalar(nudillos.length)
  }
  if (BATE_INVERTIR) {
    eje.negate()
  }

  const bate = crearBate(THREE)
  bate.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), eje.normalize())
  bate.position.copy(centro).add(new THREE.Vector3(...BATE_AJUSTE_POSICION))
  // La escala del hueso se compensa para que el bate mida lo pedido en la raiz
  const escalaMano = mano.getWorldScale(new THREE.Vector3())
  bate.scale.set(largo / escalaMano.x, largo / escalaMano.y, largo / escalaMano.z)
  mano.add(bate)
}

// Cada malla descarta lo que queda arriba del corte. El borde se deshace en
// cuadritos con un azar por celda y brilla con el color de acento.
function prepararAparicion(THREE, raiz, altura) {
  const uniformes = {
    uCorte: { value: 0 },
    uBanda: { value: altura * 0.12 },
    uCelda: { value: altura / 70 },
    uColorBorde: { value: new THREE.Color(COLOR_APARICION) },
    uRaizInversa: { value: new THREE.Matrix4() },
  }
  const medirRaiz = () => uniformes.uRaizInversa.value.copy(raiz.matrixWorld).invert()

  raiz.traverse((parte) => {
    if (!parte.isMesh) {
      return
    }
    parte.material = parte.material.clone()
    parte.material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniformes)
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>
uniform mat4 uRaizInversa;
varying vec3 vEnRaiz;`)
        // Despues del esqueleto: la altura sale de la pose animada, en el espacio de la raiz
        .replace('#include <project_vertex>', `#include <project_vertex>
vEnRaiz = (uRaizInversa * modelMatrix * vec4(transformed, 1.0)).xyz;`)
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>
uniform float uCorte;
uniform float uBanda;
uniform float uCelda;
uniform vec3 uColorBorde;
varying vec3 vEnRaiz;`)
        .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>
float azar = fract(sin(dot(floor(vEnRaiz / uCelda), vec3(12.9898, 78.233, 37.719))) * 43758.5453);
float borde = uCorte - vEnRaiz.y;
if (borde < azar * uBanda) discard;`)
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
totalEmissiveRadiance += uColorBorde * (1.0 - smoothstep(0.0, uBanda * 1.5, borde)) * 2.5;`)
    }
    parte.material.customProgramCacheKey = () => 'aparicion'
    parte.onBeforeRender = medirRaiz
  })

  // Anillo de luz que sube con el corte
  const anillo = new THREE.Mesh(
    new THREE.RingGeometry(altura * 0.26, altura * 0.3, 48),
    new THREE.MeshBasicMaterial({ color: COLOR_APARICION, transparent: true, opacity: 0.85, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }),
  )
  anillo.rotation.x = -Math.PI / 2
  anillo.visible = false
  raiz.add(anillo)

  return { uniformes, anillo }
}

// Carga el modelo una vez y pone una copia en cada ancla. `medida` es el ancho del escudo.
export async function crearJugadores(THREE, anclas, medida) {
  const [{ GLTFLoader }, { clone }] = await Promise.all([
    import('three/examples/jsm/loaders/GLTFLoader.js'),
    import('three/examples/jsm/utils/SkeletonUtils.js'),
  ])
  const gltf = await new GLTFLoader().loadAsync(`${import.meta.env.BASE_URL}${RUTA}`)

  // Con malla de esqueleto la caja de la geometria no sirve: se mide con los huesos
  gltf.scene.updateMatrixWorld(true)
  const caja = new THREE.Box3()
  gltf.scene.traverse((parte) => {
    if (parte.isBone && /^mixamorig[A-Za-z0-9]+$/.test(parte.name)) {
      caja.expandByPoint(parte.getWorldPosition(new THREE.Vector3()))
    }
  })
  const altura = ALTURA * medida
  const escala = altura / (caja.max.y - caja.min.y)
  const reposo = alRigVisible(THREE, gltf.animations.find((clip) => clip.name === 'Idle'))
  const completo = alRigVisible(THREE, gltf.animations.find((clip) => clip.name === 'Hit'))
  const golpe = THREE.AnimationUtils.subclip(completo, 'Swing', 0, FIN_DEL_SWING, 30)

  // Se clona antes de tocar el original, o las copias heredan escala y bate
  const modelos = anclas.map((_, indice) => (indice === 0 ? gltf.scene : clone(gltf.scene)))

  return anclas.map((ancla, indice) => {
    const modelo = modelos[indice]
    modelo.scale.multiplyScalar(escala)
    // Los pies quedan en el origen de la raiz
    modelo.position.y = -caja.min.y * escala
    modelo.traverse((parte) => {
      // El esqueleto en reposo no coincide con la pose animada y la caja lo recortaba
      parte.frustumCulled = false
    })

    const raiz = new THREE.Group()
    raiz.add(modelo)
    ponerBate(THREE, raiz, BATE_LARGO * altura)
    raiz.visible = false
    ancla.add(raiz)
    const { uniformes, anillo } = prepararAparicion(THREE, raiz, altura)
    const tope = altura * ALTO_DEL_CORTE
    // progreso va de 0 a 1; sentido 1 aparece, -1 desaparece, 0 quieto
    let progreso = 0
    let sentido = 0
    // Lo que el usuario lo ha girado con el dedo, aparte del escudo
    let giroPropio = 0

    const camaraLocal = new THREE.Vector3()
    const derecha = new THREE.Vector3()
    const giroCamara = new THREE.Quaternion()
    const inversa = new THREE.Matrix4()

    // Lo para a la derecha del escudo en pantalla y de frente a la camara, sin
    // importar como este girado el marcador
    const orientar = (camara) => {
      const soporte = raiz.parent
      soporte.updateWorldMatrix(true, false)
      inversa.copy(soporte.matrixWorld).invert()
      camara.getWorldPosition(camaraLocal).applyMatrix4(inversa)
      derecha.set(1, 0, 0).applyQuaternion(camara.getWorldQuaternion(giroCamara)).transformDirection(inversa)
      camaraLocal.y = 0
      derecha.y = 0
      if (camaraLocal.lengthSq() < 1e-8) {
        camaraLocal.set(0, 0, 1)
      }
      if (derecha.lengthSq() < 1e-8) {
        derecha.set(1, 0, 0)
      }
      camaraLocal.normalize()
      derecha.normalize()
      raiz.position.set(0, POSICION[1] * medida, 0)
        .addScaledVector(derecha, POSICION[0] * medida)
        .addScaledVector(camaraLocal, POSICION[2] * medida)
      raiz.rotation.y = Math.atan2(camaraLocal.x, camaraLocal.z) + GIRO + giroPropio
    }

    const animarAparicion = (delta) => {
      if (!sentido) {
        return
      }
      progreso = Math.min(1, Math.max(0, progreso + (sentido * delta) / DURACION_APARICION))
      const suave = progreso * progreso * (3 - 2 * progreso)
      uniformes.uCorte.value = -uniformes.uBanda.value + suave * (tope + uniformes.uBanda.value)
      anillo.position.y = uniformes.uCorte.value
      anillo.material.opacity = 0.85 * Math.sin(Math.PI * Math.min(1, progreso * 1.15))
      if (progreso === 1 && sentido === 1) {
        // Termino: sin corte ni brillo
        uniformes.uCorte.value = 1e3
        anillo.visible = false
        sentido = 0
      } else if (progreso === 0 && sentido === -1) {
        raiz.visible = false
        sentido = 0
      }
    }

    const mezclador = new THREE.AnimationMixer(modelo)
    const enReposo = mezclador.clipAction(reposo)
    const bateo = mezclador.clipAction(golpe)
    bateo.setLoop(THREE.LoopOnce, 1)
    bateo.clampWhenFinished = true
    enReposo.play()

    // Al terminar el swing regresa a la postura mezclando las dos poses
    mezclador.addEventListener('finished', (evento) => {
      if (evento.action === bateo) {
        enReposo.reset().play()
        bateo.crossFadeTo(enReposo, 0.5, false)
      }
    })

    return {
      raiz,
      altura,
      mezclador,
      girar(radianes) {
        giroPropio += radianes
      },
      mostrar() {
        raiz.visible = true
        anillo.visible = true
        sentido = 1
      },
      ocultar() {
        anillo.visible = true
        sentido = -1
      },
      actualizar(delta, camara) {
        mezclador.update(delta)
        animarAparicion(delta)
        if (raiz.visible) {
          orientar(camara)
        }
      },
      batear() {
        if (bateo.isRunning()) {
          return
        }
        bateo.reset().play()
        enReposo.crossFadeTo(bateo, 0.15, false)
      },
    }
  })
}
