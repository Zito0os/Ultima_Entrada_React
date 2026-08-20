import { useNavigate, useParams } from 'react-router-dom'

import PageHeader from './PageHeader'
import { finals } from './finalsData'

export default function JuegoFinal() {
  const { finalId } = useParams()
  const navigate = useNavigate()
  const final = finals.find((item) => item.id === finalId)

  if (!final) {
    return null
  }

  return (
    <main className="batting-shell">
      <PageHeader title="" backTo={`/finales/${final.id}`} />

      <section className="batting-content" aria-label="Juego de bateo">
        <div className="batting-scoreboard">
          <div><strong>{final.home}</strong><b>6</b><strong>{final.away}</strong><b>6</b></div>
          <div className="scoreboard-inning"><span>ENTRADA</span><strong>9</strong></div>
          <div><span>B - S - O</span><strong>3 - 2 - 2</strong></div>
          <span className="scoreboard-diamond" aria-hidden="true">◆</span>
        </div>

        <div className="baseball-field" aria-hidden="true">
          <div className="field-cloud cloud-one" />
          <div className="field-cloud cloud-two" />
          <div className="field-lights light-left" />
          <div className="field-lights light-right" />
          <div className="field-scoreboard" />
          <div className="field-fence" />
          <div className="field-grass" />
          <div className="field-dirt" />
          <div className="field-mound" />
          <div className="field-home" />
          <div className="field-bat" />
        </div>

        <button className="bat-button" type="button" onClick={() => navigate(`/finales/${final.id}/resultado`)}>
          YA GANÉ
        </button>
      </section>
    </main>
  )
}
