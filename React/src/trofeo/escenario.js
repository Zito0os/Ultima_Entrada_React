import { crearMaterial } from './materiales'

// Estudio donde se muestra el trofeo o cualquiera de sus piezas: luces,
// reflejos, sombra, giro con el dedo y camara que se acomoda al modelo.
const LUCES = { ambiente: 0.35, clave: 2, lateral: 1.2 }
const CONTROL = { giroPorSegundo: 0.5, cercaniaMinima: 0.4, lejaniaMaxima: 2 }
// El modelo se escala a esta altura, para que luces y sombra sirvan con cualquier pieza
const ALTO_MODELO = 6
// Si existe este archivo, el metal refleja un HDRI de verdad. Si no, se arma
// un cuarto de colores planos, que alcanza y no pesa nada.
const RUTA_HDR = `${import.meta.env.BASE_URL}entorno/estudio.hdr`

// Devuelve la funcion que desmonta todo, o null si el componente ya se fue
export async function montarEscenario(nodo, construir, sigueVivo) {
  const [THREE, { OrbitControls }] = await Promise.all([
    import('three'),
    import('three/examples/jsm/controls/OrbitControls.js'),
  ])
  const modelo = await construir(THREE)
  if (!sigueVivo()) {
    liberar(modelo)
    return null
  }

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.outputEncoding = THREE.sRGBEncoding
  // Sin mapeo de tonos el metal se quema y sale casi blanco
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.domElement.className = 'trofeo3d__lienzo'
  nodo.appendChild(renderer.domElement)

  const escena = new THREE.Scene()
  const camara = new THREE.PerspectiveCamera(38, 1, 0.1, 80)

  const grupo = new THREE.Group()
  const previa = new THREE.Box3().setFromObject(modelo)
  const medida = previa.getSize(new THREE.Vector3())
  modelo.scale.multiplyScalar(ALTO_MODELO / Math.max(medida.x, medida.y, medida.z))
  const caja = new THREE.Box3().setFromObject(modelo)
  modelo.position.sub(caja.getCenter(new THREE.Vector3()))
  grupo.add(modelo)
  escena.add(grupo)
  const medidas = caja.getSize(new THREE.Vector3())

  // El piso no se ve: solo recibe la sombra del trofeo
  const piso = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.22 }))
  piso.rotation.x = -Math.PI / 2
  piso.position.y = -medidas.y / 2
  piso.receiveShadow = true
  escena.add(piso)

  escena.add(new THREE.AmbientLight(0xffffff, LUCES.ambiente))
  const clave = new THREE.DirectionalLight(0xfff4dc, LUCES.clave)
  clave.position.set(3, 12, 4)
  clave.castShadow = true
  clave.shadow.mapSize.set(1024, 1024)
  clave.shadow.camera.near = 1
  clave.shadow.camera.far = 40
  clave.shadow.camera.left = -6
  clave.shadow.camera.right = 6
  clave.shadow.camera.top = 8
  clave.shadow.camera.bottom = -6
  clave.shadow.bias = -0.0015
  escena.add(clave)
  const lateral = new THREE.SpotLight(0xcfe2ff, LUCES.lateral, 40, 0.5, 1)
  lateral.position.set(-8, 5, 8)
  escena.add(lateral)

  // Reflejos. Primero el cuarto de colores planos, que es inmediato, y
  // despues, si el HDRI esta puesto, se cambia por el.
  const pmrem = new THREE.PMREMGenerator(renderer)
  const cielo = new THREE.Scene()
  const caras = [0x5a5048, 0x2a2622, 0xfff0dc, 0x100c08, 0xd8d0c4, 0x34302c]
    .map((color) => crearMaterial(THREE, { color, side: THREE.BackSide }, THREE.MeshBasicMaterial))
  const cuarto = new THREE.Mesh(new THREE.BoxGeometry(12, 8, 12), caras)
  cielo.add(cuarto)
  let entorno = pmrem.fromScene(cielo, 0.06).texture
  escena.environment = entorno

  // Sin el archivo, el servidor responde con el index y el cargador se
  // atora: por eso se revisa la cabecera antes de darselo
  const buscarHdr = async () => {
    const respuesta = await fetch(RUTA_HDR)
    const datos = await respuesta.arrayBuffer()
    const cabecera = new TextDecoder().decode(new Uint8Array(datos.slice(0, 2)))
    if (!respuesta.ok || cabecera !== '#?') {
      return
    }
    const { RGBELoader } = await import('three/examples/jsm/loaders/RGBELoader.js')
    const hdr = await new RGBELoader().loadAsync(RUTA_HDR)
    if (!sigueVivo()) {
      hdr.dispose()
      return
    }
    hdr.mapping = THREE.EquirectangularReflectionMapping
    const nuevo = pmrem.fromEquirectangular(hdr).texture
    hdr.dispose()
    entorno.dispose()
    entorno = nuevo
    escena.environment = entorno
  }
  buscarHdr().catch(() => {
    // se queda con el cuarto de colores
  })

  const alto = medidas.y
  const ancho = Math.max(medidas.x, medidas.z)
  const mitad = Math.tan((camara.fov * Math.PI) / 360)

  const controles = new OrbitControls(camara, renderer.domElement)
  // Dos dedos (o clic derecho) suben y bajan el punto de giro; el zoom sigue ese punto
  controles.enablePan = true
  controles.screenSpacePanning = true
  controles.enableDamping = true
  controles.dampingFactor = 0.08
  controles.autoRotate = true
  controles.autoRotateSpeed = CONTROL.giroPorSegundo * 10
  controles.maxPolarAngle = Math.PI / 2 + 0.1
  controles.target.set(0, 0, 0)

  // Solo se permite el movimiento vertical, sin salir del alto del modelo
  const sobrante = new THREE.Vector3()
  controles.addEventListener('change', () => {
    const { target } = controles
    const y = THREE.MathUtils.clamp(target.y, -alto / 2, alto / 2)
    sobrante.set(target.x, target.y - y, target.z)
    if (sobrante.lengthSq() > 0) {
      target.sub(sobrante)
      camara.position.sub(sobrante)
    }
  })

  const ajustar = () => {
    const { width, height } = nodo.getBoundingClientRect()
    if (!width || !height) {
      return
    }
    renderer.setSize(width, height, false)
    camara.aspect = width / height
    const porAlto = (alto / 2) / mitad
    const porAncho = (ancho / 2) / (mitad * camara.aspect)
    const distancia = Math.max(porAlto, porAncho) * 1.18
    controles.minDistance = distancia * CONTROL.cercaniaMinima
    controles.maxDistance = distancia * CONTROL.lejaniaMaxima
    if (!controles.isDragging) {
      camara.position.set(0, alto * 0.08, distancia)
    }
    camara.updateProjectionMatrix()
    controles.update()
  }
  ajustar()
  const observador = new ResizeObserver(ajustar)
  observador.observe(nodo)

  const reloj = new THREE.Clock()
  renderer.setAnimationLoop(() => {
    // Entra creciendo; el giro lo lleva OrbitControls
    const t = reloj.getElapsedTime()
    const entrada = Math.min(1, t / 0.6)
    grupo.scale.setScalar(0.6 + entrada * 0.4 + Math.sin(entrada * Math.PI) * 0.08)
    controles.update()
    renderer.render(escena, camara)
  })

  return () => {
    observador.disconnect()
    renderer.setAnimationLoop(null)
    controles.dispose()
    liberar(escena)
    cuarto.geometry.dispose()
    caras.forEach((cara) => cara.dispose())
    entorno?.dispose()
    pmrem.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
    renderer.domElement.remove()
  }
}

function liberar(raiz) {
  raiz.traverse((objeto) => {
    objeto.geometry?.dispose()
    const materiales = [objeto.material ?? []].flat()
    for (const material of materiales) {
      material.map?.dispose()
      material.bumpMap?.dispose()
      material.dispose()
    }
  })
}
