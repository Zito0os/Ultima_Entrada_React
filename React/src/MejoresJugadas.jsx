import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import BottomNav from './Navigation'
import Icono from './Icono'
import PageHeader from './PageHeader'
import TarjetaVideo from './TarjetaVideo'
import { historyEvents } from './historyData'
import { clipsDeEpoca, jugadas } from './videosData'

const filtros = [
  { id: 'todas', nombre: 'TODOS' },
  { id: 'jugadas', nombre: 'JUGADAS' },
  { id: 'historia', nombre: 'HISTORIA' },
]

// Las jugadas abren en su catalogo y los clips de epoca en el reproductor de videos
const todos = [
  ...jugadas.map((clip) => ({ ...clip, tipoVideo: 'jugadas', ruta: `/mejores-jugadas/${clip.id}`, detalle: [`${clip.anio} · ${clip.evento}`, clip.equipos] })),
  ...clipsDeEpoca.map((clip) => ({ ...clip, tipoVideo: 'historia', ruta: `/videos/${clip.id}` })),
]

export default function MejoresJugadas() {
  const [filtro, setFiltro] = useState('todas')
  const [epoca, setEpoca] = useState('todas')
  const [epocasAbiertas, setEpocasAbiertas] = useState(false)
  const navigate = useNavigate()

  const epocaActual = historyEvents.find((item) => item.id === epoca)
  const nombreEpoca = epocaActual ? epocaActual.period : 'TODAS LAS ÉPOCAS'

  const elegirEpoca = (id) => {
    setEpoca(id)
    setEpocasAbiertas(false)
  }

  const visibles = todos.filter((clip) => (
    (filtro === 'todas' || clip.tipoVideo === filtro)
    && (epoca === 'todas' || clip.epoca === epoca)
  ))
  const nombreDeEpoca = (id) => historyEvents.find((item) => item.id === id)?.title

  return (
    <main className="plays-shell">
      <PageHeader title="VIDEOS" backTo="/" />

      <section className="plays-content" aria-label="Videos de béisbol">
        <div className="plays-filters" role="tablist" aria-label="Filtrar por tipo de video">
          {filtros.map((item) => (
            <button className={filtro === item.id ? 'plays-filter is-active' : 'plays-filter'} type="button" role="tab" aria-selected={filtro === item.id} onClick={() => setFiltro(item.id)} key={item.id}>
              {item.nombre}
            </button>
          ))}
        </div>

        <div className="filtro-selector">
          <p className="filter-heading" id="epoca-titulo">ÉPOCA</p>
          <button
            className={epocasAbiertas ? 'filtro-actual es-abierto' : 'filtro-actual'}
            type="button"
            aria-expanded={epocasAbiertas}
            aria-labelledby="epoca-titulo"
            onClick={() => setEpocasAbiertas((abierta) => !abierta)}
          >
            <strong>{nombreEpoca}</strong>
            <Icono nombre="chevron" size={16} />
          </button>

          {epocasAbiertas && (
            <div className="filtro-lista" role="listbox" aria-label="Épocas disponibles">
              <button className={epoca === 'todas' ? 'filtro-opcion is-active' : 'filtro-opcion'} type="button" role="option" aria-selected={epoca === 'todas'} onClick={() => elegirEpoca('todas')}>
                TODAS LAS ÉPOCAS
              </button>
              {historyEvents.map((item) => (
                <button className={epoca === item.id ? 'filtro-opcion is-active' : 'filtro-opcion'} type="button" role="option" aria-selected={epoca === item.id} onClick={() => elegirEpoca(item.id)} key={item.id}>
                  {item.period} · {item.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="plays-conteo">{visibles.length} {visibles.length === 1 ? 'VIDEO' : 'VIDEOS'}</p>

        <section className="plays-list" aria-label="Lista de videos">
          {visibles.map((clip) => (
            <TarjetaVideo
              clip={clip}
              detalle={clip.detalle || [clip.periodo, nombreDeEpoca(clip.epoca)]}
              onAbrir={() => navigate(clip.ruta)}
              key={clip.id}
            />
          ))}
          {!visibles.length && <p className="plays-vacio">No hay videos con esos filtros.</p>}
        </section>
      </section>

      <BottomNav activeTab="inicio" onTabChange={() => {}} />
    </main>
  )
}
