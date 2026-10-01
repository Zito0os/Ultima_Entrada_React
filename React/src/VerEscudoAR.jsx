import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Icono from './Icono'
import { configDe, filtroDeEstabilidad } from './configEscudos'
import { useJugador } from './almacen/useJugador'
import { comprimir } from './almacen/fotos'
import { buscarEscudo } from './escudosData'
import { componerCaptura, crearEfectos } from './efectosAR'
import { cargarSVG, crearEntorno, crearExplosion, extruirDesdeSVG } from './extruirEscudo'
import { crearJugadores } from './jugadorAR'

// La extrusion mide 100 unidades y el marcador de MindAR mide 1
const ESCALA = 0.006
// Radianes por pixel al arrastrar, y cuanto se puede inclinar
const GIRO_POR_PIXEL = 0.01
const INCLINACION_MAXIMA = 0.8

export default function VerEscudoAR() {
  const { escudoId } = useParams()
  const navigate = useNavigate()
  const contenedor = useRef(null)
  const motor = useRef(null)
  const [estado, setEstado] = useState('preparando')
  const [anclado, setAnclado] = useState(false)
  const [girando, setGirando] = useState(true)
  const [efectos, setEfectos] = useState(false)
  const [jugador, setJugador] = useState(false)
  const [cargandoJugador, setCargandoJugador] = useState(false)
  const [fijado, setFijado] = useState(false)
  const [aviso, setAviso] = useState('')
  const [error, setError] = useState('')

  const { perfil, acciones } = useJugador()
  const escudo = buscarEscudo(escudoId)
  // Sin memoizar, cada render devolveria otro objeto y reiniciaria la camara
  const config = useMemo(() => configDe(perfil.escudos, escudoId, escudo.config), [perfil.escudos, escudoId, escudo.config])
  // En un ref para que las acciones no entren en las dependencias del efecto
  // que enciende la camara: cambiarlas la reiniciaria
  const registrar = useRef(acciones.registrarEscaneo)

  useEffect(() => {
    registrar.current = acciones.registrarEscaneo
  }, [acciones])

  useEffect(() => {
    const nodo = contenedor.current
    let mindar = null
    let entorno = null
    let vivo = true

    const arrancar = async () => {
      try {
        const [{ MindARThree }, THREE, datos] = await Promise.all([
          import('mind-ar/dist/mindar-image-three.prod.js'),
          import('three'),
          cargarSVG(`${import.meta.env.BASE_URL}${escudo.svg}`),
        ])
        if (!vivo) {
          return
        }

        mindar = new MindARThree({
          container: nodo,
          imageTargetSrc: `${import.meta.env.BASE_URL}marcadores/${escudo.id}.mind`,
          uiScanning: 'no',
          uiLoading: 'no',
          uiError: 'no',
          // Aguanta mas cuadros sin ver el marcador antes de esconder el modelo
          missTolerance: 24,
          warmupTolerance: 3,
          ...filtroDeEstabilidad(config.estabilidad),
        })

        const { renderer, scene, camera } = mindar
        // El mismo entorno que el visor de MODELOS, o el acabado metalico se ve
        // distinto aqui que donde se configuro
        entorno = crearEntorno(renderer)
        scene.environment = entorno
        scene.add(new THREE.AmbientLight(0xffffff, 0.6))
        const clave = new THREE.DirectionalLight(0xffffff, 0.9)
        clave.position.set(1, 2, 3)
        scene.add(clave)
        const relleno = new THREE.DirectionalLight(0x9ec9ff, 0.4)
        relleno.position.set(-2, -1, 2)
        scene.add(relleno)

        const { objeto, capas } = extruirDesdeSVG(datos, { ...config, color: escudo.color })
        objeto.scale.multiplyScalar(ESCALA * (config.escala / 100))

        // Una ancla por cada variante del escudo dentro del .mind
        const giros = []
        const animaciones = []
        // Cada copia trae sus propias capas: sin esto la explosion solo movia
        // las del original y el boton no hacia nada en las demas variantes
        const porCopia = []
        // Por ancla: el grupo que mueve MindAR, el soporte que se lleva FIJAR y el
        // escudo que se gira con el dedo. El jugador va en el soporte y gira aparte.
        const grupos = []
        const soportes = []
        const contenidos = []
        for (let indice = 0; indice < (escudo.marcadores || 1); indice += 1) {
          const giro = new THREE.Group()
          const copia = indice === 0 ? objeto : objeto.clone()
          // contenedor > grupo > capas, el mismo armado que devuelve la extrusion
          porCopia.push(indice === 0 ? capas : copia.children[0].children)
          giro.add(copia)

          const efecto = crearEfectos(THREE, ESCALA * (config.escala / 100) * 100)
          giro.add(efecto.grupo)
          animaciones.push(efecto)

          const ancla = mindar.addAnchor(indice)
          const soporte = new THREE.Group()
          const contenido = new THREE.Group()
          contenido.add(giro)
          soporte.add(contenido)
          ancla.group.add(soporte)
          grupos.push(ancla.group)
          soportes.push(soporte)
          contenidos.push(contenido)
          ancla.onTargetFound = () => {
            if (motor.current) {
              motor.current.activa = indice
            }
            setAnclado(true)
            registrar.current(escudo.id)
          }
          ancla.onTargetLost = () => setAnclado(false)
          giros.push(giro)
        }

        const explosion = crearExplosion(porCopia)

        motor.current = { THREE, medida: ESCALA * config.escala, mindar, giros, grupos, soportes, contenidos, activa: null, fijo: null, animaciones, explosion, renderer, scene, camera, girando: true, jugadores: null }

        setEstado('encendiendo')
        await mindar.start()
        if (!vivo) {
          return
        }
        setEstado('buscando')

        const reloj = new THREE.Clock()
        renderer.setAnimationLoop(() => {
          const delta = reloj.getDelta()
          motor.current?.jugadores?.forEach((uno) => uno.actualizar(delta, camera))
          if (motor.current?.girando !== false) {
            giros.forEach((giro) => { giro.rotation.y += config.velocidad / 1000 })
          }
          animaciones.forEach((efecto) => efecto.animar())
          explosion.animar()
          renderer.render(scene, camera)
        })
      } catch (fallo) {
        if (!vivo) {
          return
        }
        const nombre = fallo?.name || ''
        if (nombre === 'NotAllowedError' || nombre === 'SecurityError') {
          setError('Diste permiso denegado a la cámara. Habilítala para este sitio y vuelve a entrar.')
        } else if (nombre === 'NotFoundError') {
          setError('Este dispositivo no tiene una cámara disponible.')
        } else if (nombre === 'NotReadableError') {
          setError('Otra aplicación está usando la cámara. Ciérrala e inténtalo de nuevo.')
        } else {
          setError(fallo?.message || 'La cámara necesita una conexión segura (HTTPS) y tu permiso explícito.')
        }
        setEstado('error')
      }
    }

    arrancar()

    return () => {
      vivo = false
      if (mindar) {
        try {
          mindar.renderer.setAnimationLoop(null)
          mindar.stop()
        } catch {
          // la camara ya estaba apagada
        }
      }
      entorno?.dispose()
      motor.current?.jugadores?.forEach((uno) => uno.mezclador.stopAllAction())
      motor.current = null
    }
  }, [escudo, config])

  useEffect(() => {
    if (motor.current) {
      motor.current.girando = girando
    }
  }, [girando])

  // Arrastrar gira lo que quede mas cerca del dedo: el escudo (que tambien se
  // inclina hacia arriba o abajo) o el jugador, que solo gira sobre si mismo
  useEffect(() => {
    const nodo = contenedor.current
    let previo = null
    let objetivo = 'escudo'

    const enPantalla = (actual, punto) => {
      const marco = actual.renderer.domElement.getBoundingClientRect()
      punto.project(actual.camera)
      return { x: marco.left + ((punto.x + 1) / 2) * marco.width, y: marco.top + ((1 - punto.y) / 2) * marco.height }
    }

    const elegirObjetivo = (x, y) => {
      const actual = motor.current
      const indice = actual?.fijo?.indice ?? actual?.activa
      const jugador = actual?.jugadores?.[indice]
      if (indice == null || !jugador?.raiz.visible) {
        return 'escudo'
      }
      const { Vector3 } = actual.THREE
      const escudo = enPantalla(actual, actual.contenidos[indice].getWorldPosition(new Vector3()))
      const cuerpo = enPantalla(actual, jugador.raiz.localToWorld(new Vector3(0, jugador.altura / 2, 0)))
      return Math.hypot(x - cuerpo.x, y - cuerpo.y) < Math.hypot(x - escudo.x, y - escudo.y) ? 'jugador' : 'escudo'
    }

    const bajar = (evento) => {
      previo = { x: evento.clientX, y: evento.clientY }
      objetivo = elegirObjetivo(evento.clientX, evento.clientY)
      if (objetivo === 'escudo') {
        setGirando(false)
      }
    }
    const mover = (evento) => {
      if (!previo || !motor.current) {
        return
      }
      const dx = evento.clientX - previo.x
      const dy = evento.clientY - previo.y
      previo = { x: evento.clientX, y: evento.clientY }
      if (objetivo === 'jugador') {
        motor.current.jugadores?.forEach((uno) => uno.girar(dx * GIRO_POR_PIXEL))
        return
      }
      motor.current.contenidos.forEach((contenido) => {
        contenido.rotation.y += dx * GIRO_POR_PIXEL
        contenido.rotation.x = Math.max(-INCLINACION_MAXIMA, Math.min(INCLINACION_MAXIMA, contenido.rotation.x + dy * GIRO_POR_PIXEL))
      })
    }
    const soltar = () => {
      previo = null
    }
    nodo.addEventListener('pointerdown', bajar)
    window.addEventListener('pointermove', mover)
    window.addEventListener('pointerup', soltar)
    window.addEventListener('pointercancel', soltar)
    return () => {
      nodo.removeEventListener('pointerdown', bajar)
      window.removeEventListener('pointermove', mover)
      window.removeEventListener('pointerup', soltar)
      window.removeEventListener('pointercancel', soltar)
    }
  }, [])

  // Deja el modelo quieto en la ultima pose del marcador: deja de temblar y de
  // desaparecer cuando el marcador tiene pocos puntos. Otra vez lo regresa al ancla.
  const alternarFijado = useCallback(() => {
    const actual = motor.current
    if (!actual) {
      return
    }
    if (actual.fijo) {
      const { grupo, indice } = actual.fijo
      actual.grupos[indice].add(actual.soportes[indice])
      actual.scene.remove(grupo)
      actual.fijo = null
      setFijado(false)
      return
    }
    const indice = actual.activa
    if (indice === null || !actual.grupos[indice].visible) {
      return
    }
    const grupo = new actual.THREE.Group()
    grupo.matrixAutoUpdate = false
    grupo.matrix.copy(actual.grupos[indice].matrix)
    actual.scene.add(grupo)
    grupo.add(actual.soportes[indice])
    actual.fijo = { grupo, indice }
    setFijado(true)
  }, [])

  useEffect(() => {
    motor.current?.animaciones.forEach((efecto) => {
      efecto.grupo.visible = efectos
    })
  }, [efectos])

  // El modelo se descarga hasta que se pide, para no cargar 600 KB de mas
  const alternarJugador = useCallback(async () => {
    const actual = motor.current
    if (!actual || cargandoJugador) {
      return
    }
    if (actual.jugadores) {
      const visible = !jugador
      actual.jugadores.forEach((uno) => (visible ? uno.mostrar() : uno.ocultar()))
      setJugador(visible)
      return
    }
    setCargandoJugador(true)
    try {
      const jugadores = await crearJugadores(actual.THREE, actual.soportes, actual.medida)
      if (motor.current !== actual) {
        return
      }
      actual.jugadores = jugadores
      jugadores.forEach((uno) => uno.mostrar())
      setJugador(true)
    } catch {
      setAviso('No se pudo cargar el jugador.')
      setTimeout(() => setAviso(''), 3000)
    } finally {
      setCargandoJugador(false)
    }
  }, [jugador, cargandoJugador])

  const tomarFoto = useCallback(() => {
    const actual = motor.current
    if (!actual) {
      return
    }
    // Hay que redibujar justo antes de leer el lienzo o sale vacio
    actual.renderer.render(actual.scene, actual.camera)
    const compuesta = componerCaptura(actual.mindar.video, actual.renderer.domElement)

    // Va directo a la galeria; desde ahi se exporta al celular
    acciones.guardarFoto(`${escudo.nombre} en AR`, comprimir(compuesta))
      .then(() => setAviso('Foto guardada en tu galería.'))
      .catch(() => setAviso('No se pudo guardar la foto. Revisa tu conexión.'))
      .finally(() => setTimeout(() => setAviso(''), 3000))
  }, [escudo, acciones])

  const rotulo = estado === 'error' ? 'ERROR'
    : fijado ? 'FIJADO'
      : anclado ? 'ANCLADO'
        : estado === 'buscando' ? 'BUSCANDO ESCUDO...'
          : estado === 'encendiendo' ? 'ENCENDIENDO CÁMARA...' : 'PREPARANDO...'

  return (
    <main className="ar-ver-shell">
      <div className="ar-ver-camara" ref={contenedor} />

      {!anclado && !fijado && (
        <div className="ar-ver-marco" aria-hidden="true">
          <span /><span /><span /><span />
        </div>
      )}

      <header className="ar-ver-barra">
        <button className="ar-ver-atras" type="button" onClick={() => navigate('/ar/escudos')} aria-label="Salir del escaneo"><Icono nombre="flecha" /></button>
        <span className={anclado || fijado ? 'ar-ver-estado is-anclado' : 'ar-ver-estado'}>{rotulo}</span>
        <span className="ar-ver-equipo">{escudo.nombre}</span>
      </header>

      {estado === 'buscando' && !anclado && !fijado && (
        <p className="ar-ver-pista">Apunta al escudo impreso a unos 30 cm, con buena luz</p>
      )}
      {(anclado || fijado) && (
        <p className="ar-ver-pista es-arriba">{jugador ? 'Arrastra el escudo o al jugador para girarlo' : 'Arrastra con el dedo para girar el escudo'}</p>
      )}

      {aviso && <p className="ar-ver-aviso" role="status">{aviso}</p>}

      <footer className="ar-ver-controles">
        <div className="ar-ver-acciones">
          <button className={girando ? 'ar-ver-accion is-activa' : 'ar-ver-accion'} type="button" onClick={() => setGirando((g) => !g)} aria-pressed={girando}>
            <Icono nombre="cubo" /><span>GIRAR</span>
          </button>
          <button className={efectos ? 'ar-ver-accion is-activa' : 'ar-ver-accion'} type="button" onClick={() => setEfectos((e) => !e)} aria-pressed={efectos}>
            <Icono nombre="trofeo" /><span>EFECTOS</span>
          </button>
          <button className="ar-ver-accion" type="button" onClick={() => motor.current?.explosion.disparar()} disabled={!anclado && !fijado}>
            <Icono nombre="cartas" /><span>CAPAS</span>
          </button>
          <button className={jugador ? 'ar-ver-accion is-activa' : 'ar-ver-accion'} type="button" onClick={alternarJugador} aria-pressed={jugador} disabled={estado !== 'buscando' || cargandoJugador}>
            <Icono nombre="jugador" /><span>{cargandoJugador ? 'CARGANDO' : 'JUGADOR'}</span>
          </button>
          <button className="ar-ver-accion" type="button" onClick={() => motor.current?.jugadores?.forEach((uno) => uno.batear())} disabled={!jugador}>
            <Icono nombre="bate" /><span>BATEAR</span>
          </button>
          <button className={fijado ? 'ar-ver-accion is-activa' : 'ar-ver-accion'} type="button" onClick={alternarFijado} aria-pressed={fijado} disabled={!anclado && !fijado}>
            <Icono nombre="candado" /><span>{fijado ? 'SOLTAR' : 'FIJAR'}</span>
          </button>
          <button className="ar-ver-accion" type="button" onClick={tomarFoto} disabled={estado !== 'buscando'}>
            <Icono nombre="escudo" /><span>FOTO</span>
          </button>
        </div>

        <button className="ar-ver-ficha" type="button" onClick={() => navigate(escudo.equipo ? `/equipos/${escudo.equipo}` : '/equipos')}>
          <Icono nombre="info" size={20} />
          <span>{escudo.equipo ? 'INFO E HISTORIA DEL EQUIPO' : 'VER TODOS LOS EQUIPOS'}</span>
        </button>
      </footer>

      {error && (
        <div className="ar-ver-error" role="alert">
          <strong>No se pudo abrir la cámara</strong>
          <p>{error}</p>
          <button type="button" onClick={() => navigate('/ar/escudos')}>REGRESAR</button>
        </div>
      )}
    </main>
  )
}
