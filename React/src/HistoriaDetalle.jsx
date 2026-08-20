import { Navigate, useNavigate, useParams } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'
import { historyEvents } from './historyData'

export default function HistoriaDetalle() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const event = historyEvents.find((item) => item.id === eventId)

  if (!event) {
    return <Navigate to="/historia" replace />
  }

  return (
    <main className="history-detail-shell">
      <PageHeader title="ÉPOCA" backTo="/historia" />

      <section className="history-detail-content" aria-labelledby="history-period-title">
        <div className="history-period-card">
          <strong>{event.period}</strong>
          <h1 id="history-period-title">{event.title}</h1>
        </div>

        <p className="history-detail-description">{event.description}</p>

        <section className="milestones-section" aria-labelledby="milestones-title">
          <h2 id="milestones-title">HITOS DE LA ÉPOCA</h2>
          <div className="milestones-list">
            {event.milestones.map((milestone) => (
              <div className="milestone" key={`${milestone.year}-${milestone.text}`}>
                <strong>{milestone.year}</strong>
                <span>{milestone.text}</span>
              </div>
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
