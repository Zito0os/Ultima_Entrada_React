import { useEffect, useRef, useState } from 'react'

import { sonar } from './sonidos'

// EDITAR EL TROFEO
// ----------------
// Base negra en dos escalones, placa de latón, pilar plateado cónico, dos
// bates cruzados y la pelota arriba con sus costuras. Las medidas van en
// `PIEZAS`, en unidades del modelo: la cámara se acomoda sola al tamaño que
// salga, así que se puede crecer o encoger sin que se corte.
// En los materiales, `metalness` en 1 es metal puro y `roughness` bajo lo
// vuelve espejo. `LUCES` son las intensidades y `CONTROL` el giro.
const PIEZAS = {
  base: { ancho: 3, alto: 0.4, fondo: 3 },
  escalon: { ancho: 2.6, alto: 0.1, fondo: 2.6 },
  placa: { ancho: 2.4, alto: 0.3, fondo: 2.4 },
  pilar: { arriba: 0.7, abajo: 1.3, alto: 2.2 },
  bate: { arriba: 0.2, mango: 0.06, largo: 2.8, inclinacion: Math.PI / 10, alto: 3.5 },
  pelota: { radio: 0.8, alto: 4.8, costura: 0.02 },
}

const PLATEADO = { color: 0xD0D0D0, metalness: 1, roughness: 0.35 }
const LATON = { color: 0xC0A040, metalness: 1, roughness: 0.2 }
const PLATA_CLARA = { color: 0xE0E0E0, metalness: 0.8, roughness: 0.4 }
const ORO_PULIDO = { color: 0xE8C040, metalness: 1, roughness: 0.1 }
const NEGRO_MATE = { color: 0x080808, metalness: 0.2, roughness: 0.8 }

const LUCES = { ambiente: 0.35, clave: 2, lateral: 1.2 }
const CONTROL = { giroPorSegundo: 0.5, cercaniaMinima: 0.7, lejaniaMaxima: 2 }
// Si existe este archivo, el metal refleja un HDRI de verdad. Si no, se arma
// un cuarto de colores planos, que alcanza y no pesa nada.
const RUTA_HDR = `${import.meta.env.BASE_URL}entorno/estudio.hdr`

export default function TrofeoGanado({ nombre, pista, onCerrar, kicker = 'TROFEO NUEVO', conSonido = true }) {
  const contenedor = useRef(null)
  const [listo, setListo] = useState(false)
  const [fallo, setFallo] = useState(false)

  useEffect(() => {
    if (conSonido) {
      sonar('acierto')
    }
  }, [conSonido])

  useEffect(() => {
    const nodo = contenedor.current
    let vivo = true
    let renderer = null
    let limpiar = null

    const arrancar = async () => {
      const [THREE, { OrbitControls }] = await Promise.all([
        import('three'),
        import('three/examples/jsm/controls/OrbitControls.js'),
      ])
      if (!vivo) {
        return
      }
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
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

      const material = (ajustes) => new THREE.MeshStandardMaterial(ajustes)
      const plateado = material(PLATEADO)
      const laton = material(LATON)
      const plataClara = material(PLATA_CLARA)
      const oroPulido = material(ORO_PULIDO)
      const negro = material(NEGRO_MATE)
      const materiales = [plateado, laton, plataClara, oroPulido, negro]
      const geometrias = []
      const grupo = new THREE.Group()

      const agregar = (geometria, mat, padre = grupo) => {
        geometrias.push(geometria)
        const malla = new THREE.Mesh(geometria, mat)
        malla.castShadow = true
        malla.receiveShadow = true
        padre.add(malla)
        return malla
      }

      const { base, escalon, placa, pilar, bate, pelota } = PIEZAS
      agregar(new THREE.BoxGeometry(base.ancho, base.alto, base.fondo), negro).position.y = base.alto / 2
      agregar(new THREE.BoxGeometry(escalon.ancho, escalon.alto, escalon.fondo), negro).position.y = base.alto + escalon.alto / 2
      agregar(new THREE.BoxGeometry(placa.ancho, placa.alto, placa.fondo), laton).position.y = base.alto + escalon.alto + placa.alto / 2
      agregar(new THREE.CylinderGeometry(pilar.arriba, pilar.abajo, pilar.alto, 32), plateado).position.y = 1.8

      // Cada bate va en su propio grupo: asi el mango queda alineado con el
      // palo por mucho que se incline
      const palo = new THREE.CylinderGeometry(bate.arriba, bate.mango, bate.largo, 32)
      const cuello = new THREE.CylinderGeometry(bate.mango * 1.35, bate.mango * 1.35, 0.2, 32)
      const tapa = new THREE.BoxGeometry(0.2, 0.06, 0.2)
      geometrias.push(palo, cuello, tapa)
      for (const lado of [-1, 1]) {
        const brazo = new THREE.Group()
        brazo.position.y = bate.alto
        brazo.rotation.z = lado * bate.inclinacion
        agregar(palo, oroPulido, brazo)
        agregar(cuello, oroPulido, brazo).position.y = -bate.largo / 2 - 0.05
        agregar(tapa, oroPulido, brazo).position.y = -bate.largo / 2 - 0.18
        grupo.add(brazo)
      }

      agregar(new THREE.SphereGeometry(pelota.radio, 32, 32), plataClara).position.y = pelota.alto
      // Dos aros cruzados hacen las costuras
      const aro = new THREE.TorusGeometry(pelota.radio * 1.01, pelota.costura, 16, 64)
      geometrias.push(aro)
      for (const giro of [0, Math.PI / 2]) {
        const costura = new THREE.Mesh(aro, oroPulido)
        costura.position.y = pelota.alto
        costura.rotation.x = giro
        costura.castShadow = true
        grupo.add(costura)
      }
      escena.add(grupo)

      // El piso no se ve: solo recibe la sombra del trofeo
      const piso = new THREE.Mesh(
        new THREE.PlaneGeometry(30, 30),
        new THREE.ShadowMaterial({ opacity: 0.22 }),
      )
      piso.rotation.x = -Math.PI / 2
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
      clave.shadow.camera.bottom = -2
      clave.shadow.bias = -0.0015
      escena.add(clave)
      const lateral = new THREE.SpotLight(0xcfe2ff, LUCES.lateral, 40, 0.5, 1)
      lateral.position.set(-8, 5, 8)
      escena.add(lateral)

      // Reflejos. Primero el cuarto de colores planos, que es inmediato, y
      // despues, si el HDRI esta puesto, se cambia por el.
      const pmrem = new THREE.PMREMGenerator(renderer)
      const cielo = new THREE.Scene()
      const caras = [0x9fb0c9, 0x9fb0c9, 0xf2f6ff, 0x1b2436, 0x9fb0c9, 0xd8e4f2]
        .map((color) => new THREE.MeshBasicMaterial({ color, side: THREE.BackSide }))
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
        if (!vivo) {
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

      // La camara sale del tamano real del modelo: asi nunca se corta
      const caja = new THREE.Box3().setFromObject(grupo)
      const centro = caja.getCenter(new THREE.Vector3())
      const medidas = caja.getSize(new THREE.Vector3())
      grupo.position.y -= centro.y
      piso.position.y = -medidas.y / 2
      const alto = medidas.y
      const ancho = Math.max(medidas.x, medidas.z)
      const mitad = Math.tan((camara.fov * Math.PI) / 360)

      const controles = new OrbitControls(camara, renderer.domElement)
      controles.enablePan = false
      controles.enableDamping = true
      controles.dampingFactor = 0.08
      controles.autoRotate = true
      controles.autoRotateSpeed = CONTROL.giroPorSegundo * 10
      controles.maxPolarAngle = Math.PI / 2 + 0.1
      controles.target.set(0, 0, 0)

      const ajustar = () => {
        const { width, height } = nodo.getBoundingClientRect()
        if (!width || !height) {
          return
        }
        renderer.setSize(width, height, false)
        camara.aspect = width / height
        const porAlto = (alto / 2) / mitad
        const porAncho = (ancho / 2) / (mitad * camara.aspect)
        const distancia = Math.max(porAlto, porAncho) * 1.15
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
      setListo(true)

      const reloj = new THREE.Clock()
      renderer.setAnimationLoop(() => {
        // Entra creciendo; el giro lo lleva OrbitControls
        const t = reloj.getElapsedTime()
        const entrada = Math.min(1, t / 0.6)
        grupo.scale.setScalar(0.6 + entrada * 0.4 + Math.sin(entrada * Math.PI) * 0.08)
        controles.update()
        renderer.render(escena, camara)
      })

      limpiar = () => {
        observador.disconnect()
        renderer.setAnimationLoop(null)
        controles.dispose()
        geometrias.forEach((geometria) => geometria.dispose())
        cuarto.geometry.dispose()
        caras.forEach((cara) => cara.dispose())
        piso.geometry.dispose()
        piso.material.dispose()
        entorno?.dispose()
        pmrem.dispose()
        materiales.forEach((mat) => mat.dispose())
        renderer.dispose()
        renderer.forceContextLoss()
        renderer.domElement.remove()
      }
    }

    // Si WebGL no arranca, queda el trofeo plano en vez de un hueco
    arrancar().catch(() => setFallo(true))

    return () => {
      vivo = false
      limpiar?.()
    }
  }, [])

  return (
    <div className="trofeo3d" role="dialog" aria-modal="true" aria-label={`Trofeo ganado: ${nombre}`}>
      <p className="trofeo3d__kicker">{kicker}</p>
      {fallo ? (
        <svg className="trofeo3d__plano" viewBox="0 0 64 64" aria-hidden="true">
          <path d="M20 8h24v14a12 12 0 0 1-24 0Z" fill="currentColor" />
          <path d="M20 12h-6a8 8 0 0 0 8 8M44 12h6a8 8 0 0 1-8 8" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M29 34h6v8h-6zM22 46h20v6H22z" fill="currentColor" />
        </svg>
      ) : (
        <div className={listo ? 'trofeo3d__escena es-listo' : 'trofeo3d__escena'} ref={contenedor} />
      )}
      <strong className="trofeo3d__nombre">{nombre}</strong>
      {pista && <span className="trofeo3d__pista">{pista}</span>}
      <button className="next-question-button" type="button" onClick={onCerrar}>CONTINUAR</button>
    </div>
  )
}
