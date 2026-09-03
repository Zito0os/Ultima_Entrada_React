import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Icono from './Icono'
import { filtroDeEstabilidad, leerConfig } from './configEscudos'
import { buscarEscudo } from './escudosData'
import { componerCaptura, crearEfectos } from './efectosAR'
import { cargarSVG, crearExplosion, extruirDesdeSVG } from './extruirEscudo'

// La extrusion mide 100 unidades y el marcador de MindAR mide 1
const ESCALA = 0.006

export default function VerEscudoAR() {
  const { escudoId } = useParams()
  const navigate = useNavigate()
  const contenedor = useRef(null)
  const motor = useRef(null)
  const [estado, setEstado] = useState('preparando')
  const [anclado, setAnclado] = useState(false)
  const [girando, setGirando] = useState(true)
  const [efectos, setEfectos] = useState(false)
  const [aviso, setAviso] = useState('')
  const [error, setError] = useState('')

  const escudo = buscarEscudo(escudoId)
  // Sin memoizar, cada render devolveria otro objeto y reiniciaria la camara
  const config = useMemo(() => leerConfig(escudoId), [escudoId])

  useEffect(() => {
    const nodo = contenedor.current
    let mindar = null
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
          missTolerance: 12,
          warmupTolerance: 3,
          ...filtroDeEstabilidad(config.estabilidad),
        })

        const { renderer, scene, camera } = mindar
        scene.add(new THREE.AmbientLight(0xffffff, 1.6))
        const clave = new THREE.DirectionalLight(0xffffff, 2.4)
        clave.position.set(1, 2, 3)
        scene.add(clave)
        const relleno = new THREE.DirectionalLight(0x9ec9ff, 1.2)
        relleno.position.set(-2, -1, 2)
        scene.add(relleno)

        const { objeto, capas } = extruirDesdeSVG(datos, { ...config, color: escudo.color })
        objeto.scale.multiplyScalar(ESCALA * (config.escala / 100))

        const explosion = crearExplosion(capas, config.separacion)

        // Una ancla por cada variante del escudo dentro del .mind
        const giros = []
        const animaciones = []
        for (let indice = 0; indice < (escudo.marcadores || 1); indice += 1) {
          const giro = new THREE.Group()
          giro.add(indice === 0 ? objeto : objeto.clone())

          const efecto = crearEfectos(THREE, ESCALA * (config.escala / 100) * 100)
          giro.add(efecto.grupo)
          animaciones.push(efecto)

          const ancla = mindar.addAnchor(indice)
          ancla.group.add(giro)
          ancla.onTargetFound = () => setAnclado(true)
          ancla.onTargetLost = () => setAnclado(false)
          giros.push(giro)
        }

        motor.current = { mindar, giros, animaciones, explosion, renderer, scene, camera, girando: true }

        setEstado('encendiendo')
        await mindar.start()
        if (!vivo) {
          return
        }
        setEstado('buscando')

        renderer.setAnimationLoop(() => {
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
      motor.current = null
    }
  }, [escudo, config])

  useEffect(() => {
    if (motor.current) {
      motor.current.girando = girando
    }
  }, [girando])

  useEffect(() => {
    motor.current?.animaciones.forEach((efecto) => {
      efecto.grupo.visible = efectos
    })
  }, [efectos])

  const tomarFoto = useCallback(() => {
    const actual = motor.current
    if (!actual) {
      return
    }
    // Hay que redibujar justo antes de leer el lienzo o sale vacio
    actual.renderer.render(actual.scene, actual.camera)
    const compuesta = componerCaptura(actual.mindar.video, actual.renderer.domElement)

    compuesta.toBlob((blob) => {
      const enlace = document.createElement('a')
      enlace.href = URL.createObjectURL(blob)
      enlace.download = `ultima-entrada-${escudo.id}.png`
      enlace.click()
      setAviso('Foto guardada con el escudo incluido.')
      setTimeout(() => setAviso(''), 3000)
    }, 'image/png')
  }, [escudo])

  const rotulo = estado === 'error' ? 'ERROR'
    : anclado ? 'ANCLADO'
      : estado === 'buscando' ? 'BUSCANDO ESCUDO...'
        : estado === 'encendiendo' ? 'ENCENDIENDO CÁMARA...' : 'PREPARANDO...'

  return (
    <main className="ar-ver-shell">
      <div className="ar-ver-camara" ref={contenedor} />

      {!anclado && (
        <div className="ar-ver-marco" aria-hidden="true">
          <span /><span /><span /><span />
        </div>
      )}

      <header className="ar-ver-barra">
        <button className="ar-ver-atras" type="button" onClick={() => navigate('/ar/escudos')} aria-label="Salir del escaneo"><Icono nombre="flecha" /></button>
        <span className={anclado ? 'ar-ver-estado is-anclado' : 'ar-ver-estado'}>{rotulo}</span>
        <span className="ar-ver-equipo">{escudo.nombre}</span>
      </header>

      {estado === 'buscando' && !anclado && (
        <p className="ar-ver-pista">Apunta al escudo impreso a unos 30 cm, con buena luz</p>
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
          <button className="ar-ver-accion" type="button" onClick={() => motor.current?.explosion.disparar()} disabled={!anclado}>
            <Icono nombre="cartas" /><span>CAPAS</span>
          </button>
          <button className="ar-ver-accion" type="button" onClick={tomarFoto} disabled={estado !== 'buscando'}>
            <Icono nombre="escudo" /><span>FOTO</span>
          </button>
        </div>

        <button className="ar-ver-ficha" type="button" onClick={() => navigate(escudo.equipo ? `/equipos/${escudo.equipo}` : '/equipos')}>
          {escudo.equipo ? 'VER FICHA COMPLETA DEL EQUIPO' : 'VER TODOS LOS EQUIPOS'}
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
