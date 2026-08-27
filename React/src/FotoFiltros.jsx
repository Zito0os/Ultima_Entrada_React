import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'
import { buscarFiltro, filtros } from './filtrosData'

const ANCHO = 600
const ALTO = 365

export default function FotoFiltros() {
  const { fotoId } = useParams()
  const navigate = useNavigate()
  const lienzo = useRef(null)
  const imagen = useRef(null)
  const [filtroId, setFiltroId] = useState('termica')
  const [intensidad, setIntensidad] = useState(60)
  const [parametros, setParametros] = useState(() => Object.fromEntries(filtros.map((filtro) => [filtro.id, filtro.parametro?.valor ?? 0])))
  const [comparando, setComparando] = useState(false)
  const [aviso, setAviso] = useState('')
  const [lista, setLista] = useState(false)

  const filtro = buscarFiltro(filtroId)
  const valor = parametros[filtro.id]

  const pixelar = useCallback((ctx, foto, bloque) => {
    if (bloque <= 1) {
      ctx.drawImage(foto, 0, 0, ANCHO, ALTO)
      return
    }
    const ancho = Math.max(1, Math.round(ANCHO / bloque))
    const alto = Math.max(1, Math.round(ALTO / bloque))
    const reducido = document.createElement('canvas')
    reducido.width = ancho
    reducido.height = alto
    reducido.getContext('2d').drawImage(foto, 0, 0, ancho, alto)
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(reducido, 0, 0, ancho, alto, 0, 0, ANCHO, ALTO)
    ctx.imageSmoothingEnabled = true
  }, [])

  const dibujar = useCallback(() => {
    const canvas = lienzo.current
    const foto = imagen.current
    if (!canvas || !foto) {
      return
    }

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, ANCHO, ALTO)

    // Comparar deja la mitad izquierda sin procesar
    const inicio = comparando ? ANCHO / 2 : 0
    if (comparando) {
      ctx.filter = 'none'
      ctx.drawImage(foto, 0, 0, ANCHO, ALTO)
    }

    ctx.save()
    ctx.beginPath()
    ctx.rect(inicio, 0, ANCHO - inicio, ALTO)
    ctx.clip()

    if (filtro.id === 'pixelado') {
      pixelar(ctx, foto, Math.max(1, Math.round((valor * intensidad) / 100)))
    } else {
      ctx.filter = filtro.css(intensidad, valor)
      ctx.drawImage(foto, 0, 0, ANCHO, ALTO)
    }

    ctx.restore()
    ctx.filter = 'none'

    if (comparando) {
      ctx.fillStyle = '#F5C64B'
      ctx.fillRect(ANCHO / 2 - 2, 0, 4, ALTO)
    }
  }, [comparando, filtro, intensidad, valor, pixelar])

  useEffect(() => {
    const foto = new Image()
    foto.src = `${import.meta.env.BASE_URL}captura-ejemplo.jpg`
    foto.onload = () => {
      imagen.current = foto
      setLista(true)
    }
  }, [])

  useEffect(() => {
    if (lista) {
      dibujar()
    }
  }, [lista, dibujar])

  const cambiarParametro = (nuevo) => setParametros((actuales) => ({ ...actuales, [filtro.id]: Number(nuevo) }))

  return (
    <main className="editor-shell">
      <PageHeader title="EDITAR FOTO" backTo="/galeria" rightLabel={`${fotoId || 1} DE 18`} />

      <section className="editor-content" aria-label="Editor de foto con filtros">
        <canvas className="editor-lienzo" ref={lienzo} width={ANCHO} height={ALTO} aria-label="Vista previa de la foto editada" />

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

        <div className="editor-acciones">
          <button className={comparando ? 'editor-accion is-active' : 'editor-accion'} type="button" onClick={() => setComparando((activo) => !activo)} aria-pressed={comparando}>
            COMPARAR
          </button>
          <button className="editor-accion is-principal" type="button" onClick={() => setAviso('Copia guardada en la galería. El original queda intacto.')}>
            GUARDAR COPIA
          </button>
        </div>

        {aviso && <p className="editor-aviso" role="status">{aviso}</p>}

        <button className="editor-volver" type="button" onClick={() => navigate('/galeria')}>VOLVER A LA GALERÍA</button>
      </section>

      <BottomNav activeTab="perfil" onTabChange={() => {}} />
    </main>
  )
}
