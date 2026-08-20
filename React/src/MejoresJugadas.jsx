import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'

const filters = ['TODAS', 'JONRONES', 'ATRAPADAS', 'ÉPOCAS']

const plays = [
  { id: 'jonron-semillano', year: '1952', event: 'SERIE MUNDIAL', title: 'EL JONRÓN SELLADO', teams: 'Chicago vs New York', duration: '0:52' },
  { id: 'atrapada-esmeralda', year: '1954', event: 'SERIE MUNDIAL', title: 'LA ATRAPADA DE ESPALDAS', teams: 'New York vs Cleveland', duration: '0:41' },
  { id: 'jonron-final', year: '1993', event: 'JUEGO 6', title: 'JONRÓN PARA CERRAR LA SERIE', teams: 'Toronto vs Philadelphia', duration: '1:41' },
  { id: 'out-final', year: '2016', event: 'JUEGO 7', title: 'EL OUT FINAL TRAS LA LLUVIA', teams: 'Chicago vs Cleveland', duration: '1:18' },
  { id: 'batazo-titulo', year: '2023', event: 'JUEGO 5', title: 'EL BATAZO DEL TÍTULO', teams: 'Texas vs Arizona', duration: '0:57' },
]

export default function MejoresJugadas() {
  const [activeFilter, setActiveFilter] = useState('TODAS')
  const navigate = useNavigate()

  return (
    <main className="plays-shell">
      <PageHeader title="MEJORES JUGADAS" backTo="/" />

      <section className="plays-content" aria-label="Mejores jugadas históricas">
        <div className="plays-filters" role="tablist" aria-label="Filtrar jugadas">
          {filters.map((filter) => (
            <button className={activeFilter === filter ? 'plays-filter is-active' : 'plays-filter'} type="button" role="tab" aria-selected={activeFilter === filter} onClick={() => setActiveFilter(filter)} key={filter}>
              {filter}
            </button>
          ))}
        </div>

        <section className="plays-list" aria-label="Lista de jugadas">
          {plays.map((play) => (
            <button className="play-card" type="button" key={play.id} onClick={() => navigate(`/mejores-jugadas/${play.id}`)}>
              <span className="play-thumbnail" aria-hidden="true"><span>▶</span></span>
              <span className="play-copy">
                <span className="play-meta">{play.year} · {play.event}</span>
                <strong>{play.title}</strong>
                <small>{play.teams} {play.duration}</small>
              </span>
            </button>
          ))}
        </section>
      </section>

      <BottomNav activeTab="inicio" onTabChange={() => {}} />
    </main>
  )
}
