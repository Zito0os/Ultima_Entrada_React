import { useNavigate } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'
import { finals } from './finalsData'

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
