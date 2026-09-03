import PageHeader from './PageHeader'
import BottomNav from './Navigation'
import { useNavigate } from 'react-router-dom'
import { historyEvents } from './historyData'

function HistoryEvent({ event, onOpen }) {
  return (
    <button className="history-event" type="button" onClick={() => onOpen(event.id)}>
      <div className="history-marker" aria-hidden="true" />
      <div className="history-event-copy">
        <h2>{event.period}</h2>
        <div className="history-event-card">
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <span>{event.milestones.length} hitos · {event.figuras.length} figuras · {event.videos} videos</span>
        </div>
      </div>
    </button>
  )
}

export default function Historia() {
  const navigate = useNavigate()

  return (
    <main className="history-shell">
      <PageHeader title="HISTORIA" backTo="/" />

      <section className="history-content" aria-labelledby="history-title">
        <div className="history-intro">
          <h1 id="history-title">HISTORIA DE MLB</h1>
          <strong>LIGA AMERICANA</strong>
        </div>

        <section className="history-timeline" aria-label="Línea del tiempo del béisbol">
          {historyEvents.map((event) => <HistoryEvent event={event} onOpen={(eventId) => navigate(`/historia/${eventId}`)} key={event.id} />)}
        </section>
      </section>

      <BottomNav activeTab="historia" onTabChange={() => {}} />
    </main>
  )
}
