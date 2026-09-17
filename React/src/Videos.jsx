import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import BottomNav from './Navigation'
import Icono from './Icono'
import PageHeader from './PageHeader'
import { buscarFiltro, filtros } from './filtrosData'
import { crearMotorGL } from './filtrosGL'
import { buscarClip, clipsDeEpoca, jugadas, rutaMiniatura, rutaVideo } from './videosData'

export default function Videos() {
  const { eventId, playId } = useParams()
  const navigate = useNavigate()
  const video = useRef(null)
  const lienzo = useRef(null)
  const marco = useRef(null)
  const motor = useRef(null)
  const grabadora = useRef(null)
  const ocultar = useRef(null)

  const clipId = playId || eventId
  const clip = buscarClip(clipId) || jugadas[0]

  // Lo importado vale solo para el clip en que se cargo: al cambiar de clip se
  // vuelve solo al archivo del catalogo, sin sincronizar nada en un efecto
  const [importado, setImportado] = useState(null)
  const [filtroId, setFiltroId] = useState('pixelado')
  const [intensidad, setIntensidad] = useState(60)
  const [parametros, setParametros] = useState(() => Object.fromEntries(filtros.map((f) => [f.id, f.parametro?.valor ?? 0])))
  const [reproduciendo, setReproduciendo] = useState(false)
  const [grabando, setGrabando] = useState(false)
  const [aviso, setAviso] = useState('')
  const [error, setError] = useState('')
  const [sinGL, setSinGL] = useState(false)
  const [listaAbierta, setListaAbierta] = useState(false)
  const [silencio, setSilencio] = useState(false)
  const [controles, setControles] = useState(true)
  const [pantallaCompleta, setPantallaCompleta] = useState(false)

  const filtro = buscarFiltro(filtroId)
  const valor = parametros[filtro.id]
  const usaImportado = importado?.paraClip === clip.id
  const fuente = usaImportado ? importado.url : rutaVideo(clip.id)
  const nombreFuente = usaImportado ? importado.nombre : clip.titulo

  // El motor vive mientras viva la pantalla: recompilar los siete programas en
  // cada cambio de filtro tiraria cuadros
  useEffect(() => {
    const gl = crearMotorGL(lienzo.current)
    if (!gl) {
      setSinGL(true)
      return undefined
    }
    motor.current = gl
    return () => {
      gl.destruir()
      motor.current = null
    }
  }, [])

  // Un solo lazo que pinta cada cuadro con el filtro activo
  useEffect(() => {
    let vivo = true
    const pintar = () => {
      if (!vivo) {
        return
      }
      const nodo = video.current
      if (nodo && motor.current && nodo.readyState >= 2) {
        motor.current.dibujar(nodo, filtroId, intensidad, valor)
      }
      requestAnimationFrame(pintar)
    }
    pintar()
    return () => { vivo = false }
  }, [filtroId, intensidad, valor])

  // Los controles se van solos mientras corre el video y vuelven al tocar
  const despertarControles = () => {
    setControles(true)
    clearTimeout(ocultar.current)
    if (video.current && !video.current.paused) {
      ocultar.current = setTimeout(() => setControles(false), 2000)
    }
  }

  useEffect(() => () => clearTimeout(ocultar.current), [])

  // Al salir con Esc el navegador no avisa por otro lado que este evento
  useEffect(() => {
    const alCambiar = () => {
      if (!document.fullscreenElement) {
        setPantallaCompleta(false)
      }
    }
    document.addEventListener('fullscreenchange', alCambiar)
    return () => document.removeEventListener('fullscreenchange', alCambiar)
  }, [])

  // Con la pantalla simulada no hay Esc del navegador, hay que escucharlo aqui
  useEffect(() => {
    if (!pantallaCompleta) {
      return undefined
    }
    const alTeclear = (evento) => {
      if (evento.key === 'Escape') {
        setPantallaCompleta(false)
      }
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [pantallaCompleta])

  const alternar = () => {
    const nodo = video.current
    if (!nodo) {
      return
    }
    if (nodo.paused) {
      nodo.play().then(() => {
        setReproduciendo(true)
        clearTimeout(ocultar.current)
        ocultar.current = setTimeout(() => setControles(false), 1200)
      }).catch((fallo) => setError(fallo.message))
    } else {
      nodo.pause()
      setReproduciendo(false)
      clearTimeout(ocultar.current)
      setControles(true)
    }
  }

  // La clase manda: en iPhone requestFullscreen solo acepta el <video>, y aqui
  // el que se ve es el lienzo con el filtro. Se pide la nativa por si la hay y
  // si no, el marco se estira con CSS y se ve igual.
  const alternarPantalla = () => {
    if (pantallaCompleta) {
      setPantallaCompleta(false)
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {})
      }
      return
    }
    setPantallaCompleta(true)
    marco.current?.requestFullscreen?.().catch(() => {})
  }

  const importar = (evento) => {
    const archivo = evento.target.files?.[0]
    if (!archivo) {
      return
    }
    if (importado) {
      URL.revokeObjectURL(importado.url)
    }
    setImportado({ url: URL.createObjectURL(archivo), nombre: archivo.name, paraClip: clip.id })
    setError('')
  }

  const cambiarParametro = (nuevo) => setParametros((actuales) => ({ ...actuales, [filtro.id]: Number(nuevo) }))

  // Se graba el lienzo, no el video: asi el archivo sale con el filtro encima
  const guardarClip = () => {
    if (grabando) {
      grabadora.current?.stop()
      return
    }
    const flujo = lienzo.current.captureStream(30)
    const trozos = []
    const rec = new MediaRecorder(flujo, { mimeType: 'video/webm' })
    rec.ondataavailable = (evento) => trozos.push(evento.data)
    rec.onstop = () => {
      const enlace = document.createElement('a')
      enlace.href = URL.createObjectURL(new Blob(trozos, { type: 'video/webm' }))
      enlace.download = `ultima-entrada-${clip.id}-${filtro.id}.webm`
      enlace.click()
      setGrabando(false)
      setAviso('Clip guardado con el filtro aplicado.')
      setTimeout(() => setAviso(''), 3200)
    }
    grabadora.current = rec
    rec.start()
    setGrabando(true)
    setAviso('Grabando. Vuelve a tocar para terminar.')
  }

  const relacionados = (playId ? jugadas : clipsDeEpoca).filter((item) => item.id !== clip.id).slice(0, 3)

  return (
    <main className="videos-shell">
      <PageHeader title="VIDEOS" backTo={eventId ? `/historia/${eventId}` : '/mejores-jugadas'} />

      <section className="videos-content" aria-label="Reproductor con filtros">
        <div
          className={`video-marco${controles ? '' : ' es-limpio'}${pantallaCompleta ? ' es-completa' : ''}`}
          ref={marco}
          onPointerMove={despertarControles}
        >
          <canvas className="video-lienzo" ref={lienzo} aria-label={`${nombreFuente} con filtro ${filtro.nombre}`} />
          <video
            className="video-oculto"
            ref={video}
            src={fuente}
            playsInline
            loop
            muted={silencio}
            crossOrigin="anonymous"
            onError={() => setError('No se encontró el clip. Importa uno desde tu teléfono.')}
            onPlay={() => setReproduciendo(true)}
            onPause={() => setReproduciendo(false)}
          />
          <button className="video-play" type="button" onClick={alternar} aria-label={reproduciendo ? 'Pausar' : 'Reproducir'}>
            <span><Icono nombre={reproduciendo ? 'pausa' : 'reproducir'} size={32} /></span>
          </button>

          <div className="video-controles">
            <button
              className={silencio ? 'video-boton es-apagado' : 'video-boton'}
              type="button"
              onClick={() => setSilencio((antes) => !antes)}
              aria-label={silencio ? 'Activar el audio' : 'Silenciar'}
            >
              <Icono nombre={silencio ? 'bocinaMuda' : 'bocina'} size={21} />
            </button>
            <button
              className="video-boton"
              type="button"
              onClick={alternarPantalla}
              aria-label={pantallaCompleta ? 'Salir de pantalla completa' : 'Ver en pantalla completa'}
            >
              <Icono nombre={pantallaCompleta ? 'salirPantallaCompleta' : 'pantallaCompleta'} size={19} />
            </button>
          </div>
        </div>

        <p className="video-nombre">{nombreFuente}</p>
        {sinGL && <p className="video-error" role="alert">Este navegador no tiene WebGL, así que los filtros no se pueden aplicar.</p>}
        {error && <p className="video-error" role="alert">{error}</p>}

        <div className="video-fuente">
          <label className="video-importar">
            IMPORTAR VIDEO
            <input type="file" accept="video/*" onChange={importar} />
          </label>
        </div>

        <div className="filtro-selector">
          <p className="filter-heading" id="filtro-titulo">FILTRO APLICADO</p>
          <button
            className={listaAbierta ? 'filtro-actual es-abierto' : 'filtro-actual'}
            type="button"
            aria-expanded={listaAbierta}
            aria-labelledby="filtro-titulo"
            onClick={() => setListaAbierta((abierta) => !abierta)}
          >
            <strong>{filtro.nombre}</strong>
            <Icono nombre="chevron" size={16} />
          </button>

          {listaAbierta && (
            <div className="filtro-lista" role="listbox" aria-label="Filtros disponibles">
              {filtros.map((opcion) => (
                <button
                  className={filtroId === opcion.id ? 'filtro-opcion is-active' : 'filtro-opcion'}
                  type="button"
                  role="option"
                  aria-selected={filtroId === opcion.id}
                  onClick={() => { setFiltroId(opcion.id); setListaAbierta(false) }}
                  key={opcion.id}
                >
                  {opcion.nombre}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="intensity-panel">
          <div className="intensity-label"><strong>INTENSIDAD</strong><span>{intensidad}%</span></div>
          <input type="range" min="0" max="100" value={intensidad} onChange={(e) => setIntensidad(Number(e.target.value))} aria-label="Intensidad del filtro" disabled={filtro.id === 'original'} />
          {filtro.parametro && (
            <>
              <div className="intensity-label"><strong>{filtro.parametro.etiqueta}</strong><span>{valor}{filtro.parametro.unidad}</span></div>
              <input type="range" min={filtro.parametro.min} max={filtro.parametro.max} value={valor} onChange={(e) => cambiarParametro(e.target.value)} aria-label={filtro.parametro.etiqueta} />
            </>
          )}
        </div>

        <button className={grabando ? 'save-clip-button is-grabando' : 'save-clip-button'} type="button" onClick={guardarClip}>
          {grabando ? 'TERMINAR Y GUARDAR' : 'GUARDAR CLIP'}
        </button>
        {aviso && <p className="video-aviso" role="status">{aviso}</p>}

        <p className="more-videos-heading">MÁS VIDEOS</p>
        <section className="related-videos" aria-label="Más videos">
          {relacionados.map((item) => (
            <button
              className="related-video"
              type="button"
              key={item.id}
              style={{ backgroundImage: `url(${rutaMiniatura(item.id)})` }}
              onClick={() => { setError(''); navigate(playId ? `/mejores-jugadas/${item.id}` : `/videos/${item.id}`) }}
            >
              <span className="related-play"><Icono nombre="reproducir" size={16} /></span>
              <small>{item.titulo}</small>
            </button>
          ))}
        </section>
      </section>

      <BottomNav activeTab="historia" onTabChange={() => {}} />
    </main>
  )
}
