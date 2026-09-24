import { useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import Icono from './Icono'
import BottomNav from './Navigation'
import PageHeader from './PageHeader'
import { buscarFiltro, filtros } from './filtrosData'
import { useJugador } from './almacen/useJugador'
import { comprimir, leerImagen } from './almacen/fotos'

function pixelar(ctx, foto, bloque, ancho, alto) {
  if (bloque <= 1) {
    ctx.drawImage(foto, 0, 0, ancho, alto)
    return
  }
  const chico = document.createElement('canvas')
  chico.width = Math.max(1, Math.round(ancho / bloque))
  chico.height = Math.max(1, Math.round(alto / bloque))
  chico.getContext('2d').drawImage(foto, 0, 0, chico.width, chico.height)
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(chico, 0, 0, chico.width, chico.height, 0, 0, ancho, alto)
  ctx.imageSmoothingEnabled = true
}

// Gira la foto en cuartos de vuelta; con 1 o 3 se intercambian ancho y alto
function orientar(foto, giro) {
  const deLado = giro % 2 === 1
  const salida = document.createElement('canvas')
  salida.width = deLado ? foto.naturalHeight : foto.naturalWidth
  salida.height = deLado ? foto.naturalWidth : foto.naturalHeight
  const ctx = salida.getContext('2d')
  ctx.translate(salida.width / 2, salida.height / 2)
  ctx.rotate((giro * Math.PI) / 2)
  ctx.drawImage(foto, -foto.naturalWidth / 2, -foto.naturalHeight / 2)
  return salida
}

export default function FotoFiltros() {
  const { fotoId } = useParams()
  const navigate = useNavigate()
  const { perfil, usuarioId, acciones } = useJugador()
  const lienzo = useRef(null)
  const imagen = useRef(null)
  const [filtroId, setFiltroId] = useState('termica')
  const [intensidad, setIntensidad] = useState(60)
  const [parametros, setParametros] = useState(() => Object.fromEntries(filtros.map((filtro) => [filtro.id, filtro.parametro?.valor ?? 0])))
  const [comparando, setComparando] = useState(false)
  const [aviso, setAviso] = useState('')
  const [natural, setNatural] = useState(null)
  const [giro, setGiro] = useState(0)
  const [guardando, setGuardando] = useState(false)

  const filtro = buscarFiltro(filtroId)
  const valor = parametros[filtro.id]
  const indice = perfil.galeria.findIndex((foto) => foto.id === fotoId)
  const foto = perfil.galeria[indice]
  const lista = Boolean(natural)
  // Vertical: los controles van a un lado. Horizontal: abajo.
  const vertical = lista && (giro % 2 === 1 ? natural.ancho > natural.alto : natural.alto > natural.ancho)

  // Pinta la foto girada y filtrada; comparar deja la mitad izquierda sin procesar
  const pintar = useCallback((canvas, conComparar) => {
    const original = orientar(imagen.current, giro)
    canvas.width = original.width
    canvas.height = original.height
    const { width: ancho, height: alto } = canvas
    const ctx = canvas.getContext('2d')

    const inicio = conComparar ? ancho / 2 : 0
    if (conComparar) {
      ctx.filter = 'none'
      ctx.drawImage(original, 0, 0, ancho, alto)
    }

    ctx.save()
    ctx.beginPath()
    ctx.rect(inicio, 0, ancho - inicio, alto)
    ctx.clip()

    if (filtro.id === 'pixelado') {
      pixelar(ctx, original, Math.max(1, Math.round((valor * intensidad) / 100)), ancho, alto)
    } else {
      ctx.filter = filtro.css(intensidad, valor)
      ctx.drawImage(original, 0, 0, ancho, alto)
    }

    ctx.restore()
    ctx.filter = 'none'

    if (conComparar) {
      ctx.fillStyle = '#F5C64B'
      ctx.fillRect(ancho / 2 - 2, 0, 4, alto)
    }
  }, [filtro, intensidad, valor, giro])

  useEffect(() => {
    let vivo = true
    leerImagen(usuarioId, fotoId)
      .then((datos) => {
        if (!vivo) {
          return
        }
        if (!datos) {
          setAviso('No se encontró la imagen de esta foto.')
          return
        }
        const nueva = new Image()
        nueva.onload = () => {
          if (vivo) {
            imagen.current = nueva
            setNatural({ ancho: nueva.naturalWidth, alto: nueva.naturalHeight })
          }
        }
        nueva.src = datos
      })
      .catch(() => vivo && setAviso('No se pudo cargar la foto. Revisa tu conexión.'))
    return () => {
      vivo = false
    }
  }, [usuarioId, fotoId])

  useEffect(() => {
    if (lista && lienzo.current) {
      pintar(lienzo.current, comparando)
    }
  }, [lista, pintar, comparando])

  // La copia sale girada, sin la linea de comparar, y el original no se toca
  const guardarCopia = async () => {
    const salida = document.createElement('canvas')
    pintar(salida, false)
    setGuardando(true)
    try {
      await acciones.guardarFoto(`${foto.nombre} (${filtro.nombre.toLowerCase()})`, comprimir(salida), true)
      setAviso('Copia guardada en la galería. El original queda intacto.')
    } catch {
      setAviso('No se pudo guardar la copia. Revisa tu conexión e inténtalo otra vez.')
    } finally {
      setGuardando(false)
    }
  }

  const cambiarParametro = (nuevo) => setParametros((actuales) => ({ ...actuales, [filtro.id]: Number(nuevo) }))

  if (!foto) {
    return <Navigate to="/galeria" replace />
  }

  return (
    <main className="editor-shell">
      <PageHeader title="EDITAR FOTO" backTo="/galeria" rightLabel={`${indice + 1} DE ${perfil.galeria.length}`} />

      <section className={vertical ? 'editor-content es-vertical' : 'editor-content'} aria-label="Editor de foto con filtros">
        <canvas className="editor-lienzo" ref={lienzo} aria-label="Vista previa de la foto editada" />

        <div className="editor-controles">
          <p className="filter-heading">FILTRO APLICADO</p>
          <div className="video-filters" aria-label="Filtros disponibles">
            {filtros.map((opcion) => (
              <button className={filtroId === opcion.id ? 'video-filter is-active' : 'video-filter'} type="button" onClick={() => setFiltroId(opcion.id)} aria-pressed={filtroId === opcion.id} key={opcion.id}>
                {opcion.nombre}
              </button>
            ))}
          </div>

          <div className="intensity-panel">
            <div className="intensity-label"><strong>INTENSIDAD</strong><span>{intensidad}%</span></div>
            <input type="range" min="0" max="100" value={intensidad} onChange={(event) => setIntensidad(Number(event.target.value))} aria-label="Intensidad del filtro" disabled={filtro.id === 'original'} />
            {filtro.parametro ? (
              <>
                <div className="intensity-label"><strong>{filtro.parametro.etiqueta}</strong><span>{valor}{filtro.parametro.unidad}</span></div>
                <input type="range" min={filtro.parametro.min} max={filtro.parametro.max} value={valor} onChange={(event) => cambiarParametro(event.target.value)} aria-label={filtro.parametro.etiqueta} />
              </>
            ) : (
              <small>SIN PROCESAR, ASÍ SE VE EL ORIGINAL</small>
            )}
          </div>

          <div className="editor-giro">
            <button className="editor-accion es-izquierda" type="button" onClick={() => setGiro((antes) => (antes + 3) % 4)} disabled={!lista} aria-label="Girar a la izquierda">
              <Icono nombre="girar" size={18} /> GIRAR
            </button>
            <button className="editor-accion" type="button" onClick={() => setGiro((antes) => (antes + 1) % 4)} disabled={!lista} aria-label="Girar a la derecha">
              GIRAR <Icono nombre="girar" size={18} />
            </button>
          </div>

          <div className="editor-acciones">
            <button className={comparando ? 'editor-accion is-active' : 'editor-accion'} type="button" onClick={() => setComparando((activo) => !activo)} aria-pressed={comparando}>
              COMPARAR
            </button>
            <button className="editor-accion is-principal" type="button" onClick={guardarCopia} disabled={!lista || guardando}>
              GUARDAR COPIA
            </button>
          </div>

          {aviso && <p className="editor-aviso" role="status">{aviso}</p>}

          <button className="editor-volver" type="button" onClick={() => navigate('/galeria')}>VOLVER A LA GALERÍA</button>
        </div>
      </section>

      <BottomNav activeTab="perfil" onTabChange={() => {}} />
    </main>
  )
}
