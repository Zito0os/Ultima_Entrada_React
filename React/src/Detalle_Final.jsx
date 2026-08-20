import { Navigate, useNavigate, useParams } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'
import { finals } from './finalsData'

function TeamMark({ abbreviation }) {
  return <span className={`detail-final-team mark-${abbreviation.toLowerCase()}`}>{abbreviation}</span>
}

export default function DetalleFinal() {
  const { finalId } = useParams()
  const navigate = useNavigate()
  const final = finals.find((item) => item.id === finalId)

  if (!final) {
    return <Navigate to="/finales" replace />
  }

  return (
    <main className="final-detail-shell">
      <PageHeader title="" backTo="/finales" />

      <section className="final-detail-content" aria-label={`Detalle de la final de ${final.year}`}>
        <div className="final-detail-matchup">
          <TeamMark abbreviation={final.home} />
          <strong>VS</strong>
          <TeamMark abbreviation={final.away} />
        </div>

        <div className="final-scoreboard">
          <h1>{final.series}</h1>
          <p className="score-innings">1 2 3 4 5 6 7 8 9</p>
          <div><strong>{final.home}</strong><span>{final.scores[0]}</span></div>
          <div><strong>{final.away}</strong><span>{final.scores[1]}</span></div>
        </div>

        <p className="final-detail-inning">{final.inning}</p>

        <button className="play-final-button" type="button" onClick={() => navigate(`/finales/${final.id}/jugar`)}>
          JUGAR
        </button>
      </section>

      <BottomNav activeTab="inicio" onTabChange={() => {}} />
    </main>
  )
}
