import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'

import './App.css'
import AR from './AR'
import EquipoDetalle from './EquipoDetalle'
import Equipos from './Equipos'
import BottomNav from './Navigation'
import Perfil from './Perfil'
import PageHeader from './PageHeader'
import Videos from './Videos'

function HomePage() {
  const [activeTab, setActiveTab] = useState('inicio')
  const [isChallengeOpen, setIsChallengeOpen] = useState(false)

  const contentCards = [
    { id: 'trivia', title: 'TRIVIA', subtitle: 'Pon a prueba tus conocimientos', icon: '?', tone: 'green' },
    { id: 'sobres', title: 'SOBRES', subtitle: 'Descubre premios sorpresa', icon: '✦', tone: 'violet' },
    { id: 'videos', title: 'VIDEOS', subtitle: 'Aprende jugando', icon: '▶', tone: 'red' },
  ]

  return (
    <main className="app-shell">
      <header className="topbar">
        <PageHeader title="INICIO" />

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

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

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

function AppRoutes() {
  const location = useLocation()

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/ar" element={<AR />} />
      <Route path="/equipos" element={<Equipos />} />
      <Route path="/equipos/:teamId" element={<EquipoDetalle />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="*" element={<Navigate to={location.pathname.startsWith('/equipos') ? '/equipos' : '/'} replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
