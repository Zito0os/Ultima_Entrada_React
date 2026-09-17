import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import BottomNav from './Navigation'
import Icono from './Icono'
import PageHeader from './PageHeader'
import { historyEvents } from './historyData'
import { jugadas, rutaMiniatura } from './videosData'

const filtros = [
  { id: 'todas', nombre: 'TODAS' },
  { id: 'jonrones', nombre: 'JONRONES' },
  { id: 'atrapadas', nombre: 'ATRAPADAS' },
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

  const visibles = jugadas.filter((jugada) => (
    (filtro === 'todas' || jugada.tipo === filtro)
    && (epoca === 'todas' || jugada.epoca === epoca)
  ))

  return (
    <main className="plays-shell">
      <PageHeader title="MEJORES JUGADAS" backTo="/" />

      <section className="plays-content" aria-label="Mejores jugadas históricas">
        <div className="plays-filters" role="tablist" aria-label="Filtrar por tipo de jugada">
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

        <section className="plays-list" aria-label="Lista de jugadas">
          {visibles.map((jugada) => (
            <button className="play-card" type="button" key={jugada.id} onClick={() => navigate(`/mejores-jugadas/${jugada.id}`)}>
              <span className="play-thumbnail" style={{ backgroundImage: `url(${rutaMiniatura(jugada.id)})` }}>
                <span><Icono nombre="reproducir" size={15} /></span>
              </span>
              <span className="play-copy">
                <span className="play-meta">{jugada.anio ? `${jugada.anio} · ` : ''}{jugada.evento}</span>
                <strong>{jugada.titulo}</strong>
                <small>{jugada.equipos} {jugada.duracion}</small>
              </span>
            </button>
          ))}
          {!visibles.length && <p className="plays-vacio">No hay jugadas con esos filtros.</p>}
        </section>
      </section>

      <BottomNav activeTab="inicio" onTabChange={() => {}} />
    </main>
  )
}
