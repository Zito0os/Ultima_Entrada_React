import { useState } from 'react'

import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('inicio')
  const [isChallengeOpen, setIsChallengeOpen] = useState(false)

  const contentCards = [
    { id: 'trivia', title: 'TRIVIA', subtitle: 'Pon a prueba tus conocimientos', icon: '?', tone: 'green' },
    { id: 'sobres', title: 'SOBRES', subtitle: 'Descubre premios sorpresa', icon: '✦', tone: 'violet' },
    { id: 'videos', title: 'VIDEOS', subtitle: 'Aprende jugando', icon: '▶', tone: 'red' },
  ]

  const navigation = [
    { id: 'inicio', label: 'INICIO', icon: '⌂' },
    { id: 'equipos', label: 'EQUIPOS', icon: '♟' },
    { id: 'ar', label: 'AR', icon: '◇' },
    { id: 'videos', label: 'VIDEOS', icon: '▸' },
    { id: 'perfil', label: 'PERFIL', icon: '●' },
  ]

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-row">
          <h1>INICIO</h1>
          <div className="stats" aria-label="Progreso del jugador">
            <span className="coins"><span className="coin-icon">✦</span> 340</span>
            <span className="trophies"><span className="trophy-icon">♜</span> 3/24</span>
          </div>
        </div>

        <section className="daily-challenge" aria-labelledby="challenge-title">
          <p className="eyebrow">RETO DE HOY</p>
          <h2 id="challenge-title">ÚLTIMA<br />ENTRADA</h2>
          <p className="challenge-meta">Serie Mundial 1975 · Juego 6 · Cierre del 9°</p>
          <p className="reward"><strong>1 TROFEO</strong><span>+</span><strong>50 MONEDAS</strong></p>
          <div className="challenge-actions">
            <button className="button button-primary" type="button" onClick={() => setIsChallengeOpen(true)}>JUGAR</button>
            <button className="button button-secondary" type="button" onClick={() => setActiveTab('reglas')}>REGLAS</button>
          </div>
        </section>
      </header>

      <section className="content-grid" aria-label="Contenido de Zito">
        {contentCards.map((card) => (
          <button className={`content-card card-${card.tone}`} type="button" key={card.id} onClick={() => setActiveTab(card.id)}>
            <span className="card-copy"><strong>{card.title}</strong><small>{card.subtitle}</small></span>
            <span className="card-icon" aria-hidden="true">{card.icon}</span>
          </button>
        ))}
      </section>

      <nav className="bottom-nav" aria-label="Navegación principal">
        {navigation.map((item) => (
          <button className={activeTab === item.id ? 'nav-item is-active' : 'nav-item'} type="button" key={item.id} onClick={() => setActiveTab(item.id)} aria-current={activeTab === item.id ? 'page' : undefined}>
            <span className="nav-icon" aria-hidden="true">{item.icon}</span><span>{item.label}</span>
          </button>
        ))}
      </nav>

      {isChallengeOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsChallengeOpen(false)}>
          <section className="challenge-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(event) => event.stopPropagation()}>
            <button className="close-button" type="button" aria-label="Cerrar reto" onClick={() => setIsChallengeOpen(false)}>×</button>
            <span className="modal-kicker">RETO DE HOY</span>
            <h2 id="modal-title">¿LISTO PARA<br />LA ÚLTIMA ENTRADA?</h2>
            <p>Responde 5 preguntas y consigue el trofeo del día.</p>
            <button className="button button-primary modal-action" type="button" onClick={() => setIsChallengeOpen(false)}>COMENZAR</button>
          </section>
        </div>
      )}
    </main>
  )
}

export default App
