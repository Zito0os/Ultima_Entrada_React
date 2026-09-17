import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'
import { historyEvents } from './historyData'
import { jugadas } from './videosData'

const filtros = [
  { id: 'todas', nombre: 'TODAS' },
  { id: 'jonrones', nombre: 'JONRONES' },
  { id: 'atrapadas', nombre: 'ATRAPADAS' },
]

export default function MejoresJugadas() {
  const [filtro, setFiltro] = useState('todas')
  const [epoca, setEpoca] = useState('todas')
  const navigate = useNavigate()

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

        <div className="plays-filters" role="tablist" aria-label="Filtrar por época">
          <button className={epoca === 'todas' ? 'plays-filter is-active' : 'plays-filter'} type="button" role="tab" aria-selected={epoca === 'todas'} onClick={() => setEpoca('todas')}>
            TODAS LAS ÉPOCAS
          </button>
          {historyEvents.map((item) => (
            <button className={epoca === item.id ? 'plays-filter is-active' : 'plays-filter'} type="button" role="tab" aria-selected={epoca === item.id} onClick={() => setEpoca(item.id)} key={item.id}>
              {item.period}
            </button>
          ))}
        </div>

        <section className="plays-list" aria-label="Lista de jugadas">
          {visibles.map((jugada) => (
            <button className="play-card" type="button" key={jugada.id} onClick={() => navigate(`/mejores-jugadas/${jugada.id}`)}>
              <span className="play-thumbnail" aria-hidden="true"><span>▶</span></span>
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
