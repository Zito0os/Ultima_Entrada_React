import { useNavigate } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'

const finals = [
  { id: '1975', year: '1975', home: 'NY', away: 'BRS', description: 'Cierre del 9° · empate 6-6 · 2 outs', status: 'pending' },
  { id: '1991', year: '1991', home: 'MIN', away: 'BRS', description: 'Cierre del 10° · 0-0 · trofeo obtenido', status: 'completed' },
  { id: '1996', year: '1996', home: 'NY', away: 'ATL', description: 'Cierre del 9° · 3-2 · trofeo obtenido', status: 'completed' },
  { id: '2001', year: '2001', home: 'ARI', away: 'NY', description: 'Cierre del 9° · juego decisivo', status: 'pending' },
]

function TeamMark({ abbreviation }) {
  return <span className={`final-team-mark mark-${abbreviation.toLowerCase()}`}>{abbreviation}</span>
}

export default function Finales() {
  const navigate = useNavigate()

  return (
    <main className="finals-shell">
      <PageHeader title="FINALES" backTo="/" />

      <section className="finals-content" aria-label="Finales históricas">
        {finals.map((final) => (
          <button className="final-card" type="button" key={final.id} onClick={() => navigate(`/finales/${final.id}`)}>
            <span className={final.status === 'completed' ? 'final-status is-completed' : 'final-status is-pending'} aria-label={final.status === 'completed' ? 'Trofeo obtenido' : 'Final pendiente'}>
              {final.status === 'completed' ? '✓' : '!'}
            </span>
            <div className="final-main">
              <strong className="final-year">{final.year}</strong>
              <div className="final-matchup">
                <TeamMark abbreviation={final.home} />
                <b>VS</b>
                <TeamMark abbreviation={final.away} />
              </div>
              <p>{final.description}</p>
            </div>
          </button>
        ))}
      </section>

      <BottomNav activeTab="inicio" onTabChange={() => {}} />
    </main>
  )
}
