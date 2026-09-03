import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'
import { historyEvents } from './historyData'

export default function HistoriaDetalle() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [hitoAbierto, setHitoAbierto] = useState(null)
  const event = historyEvents.find((item) => item.id === eventId)

  if (!event) {
    return <Navigate to="/historia" replace />
  }

  const abrirHito = (year) => setHitoAbierto((actual) => (actual === year ? null : year))

  return (
    <main className="history-detail-shell">
      <PageHeader title="ÉPOCA" backTo="/historia" />

      <section className="history-detail-content" aria-labelledby="history-period-title">
        <div className="history-period-card">
          <strong>{event.period}</strong>
          <h1 id="history-period-title">{event.title}</h1>
        </div>

        <p className="history-detail-description">{event.description}</p>

        <section className="history-texto" aria-label="Relato de la época">
          {event.texto.map((parrafo) => <p key={parrafo.slice(0, 40)}>{parrafo}</p>)}
        </section>

        <section className="milestones-section" aria-labelledby="milestones-title">
          <h2 id="milestones-title">HITOS DE LA ÉPOCA</h2>
          <div className="milestones-list">
            {event.milestones.map((milestone) => (
              <div className="milestone-bloque" key={milestone.year + milestone.text}>
                <button
                  className={hitoAbierto === milestone.year ? 'milestone is-abierto' : 'milestone'}
                  type="button"
                  onClick={() => abrirHito(milestone.year)}
                  aria-expanded={hitoAbierto === milestone.year}
                >
                  <strong>{milestone.year}</strong>
                  <span>{milestone.text}</span>
                  <b aria-hidden="true">{hitoAbierto === milestone.year ? '−' : '+'}</b>
                </button>
                {hitoAbierto === milestone.year && <p className="milestone-nota">{milestone.nota}</p>}
              </div>
            ))}
          </div>
        </section>

        <section className="figuras-section" aria-labelledby="figuras-title">
          <h2 id="figuras-title">FIGURAS DE LA ÉPOCA</h2>
          <div className="figuras-list">
            {event.figuras.map((figura) => (
              <article className="figura" key={figura.nombre}>
                <strong>{figura.nombre}</strong>
                <span>{figura.papel}</span>
                <p>{figura.texto}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="era-videos" aria-labelledby="era-videos-title">
          <h2 id="era-videos-title">VIDEOS DE LA ÉPOCA</h2>
          <div className="era-video-list">
            {Array.from({ length: Math.max(event.videos, 3) }, (_, index) => (
              <button className={`era-video era-video-${index + 1}`} type="button" key={index} onClick={() => navigate(`/videos/${event.id}`)} aria-label={`Reproducir video ${index + 1}`}>
                <span aria-hidden="true">▶</span>
              </button>
            ))}
          </div>
        </section>
      </section>

      <BottomNav activeTab="historia" onTabChange={() => {}} />
    </main>
  )
}
