import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'

const regions = ['ESTE', 'CENTRAL', 'OESTE']

export default function Escudos() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeRegion, setActiveRegion] = useState('ESTE')
  const [isAnimating, setIsAnimating] = useState(false)

  if (!location.pathname.endsWith('/anclado')) {
    return (
      <main className="ar-scan-shell">
        <PageHeader title="AR" backTo="/ar" />
        <section className="ar-scan-content" aria-label="Escáner de escudos">
          <div className="scan-mode-toolbar">
            <button className="mode-back" type="button" onClick={() => navigate('/ar')} aria-label="Volver a seleccionar modo">←</button>
            <span className="mode-chip is-active">DIVISIÓN ESTE</span>
            <span className="mode-chip">5 ESCUDOS</span>
          </div>
          <div className="scan-frame" aria-hidden="true">
            <span className="scan-corner corner-top-left" /><span className="scan-corner corner-top-right" />
            <span className="scan-corner corner-bottom-left" /><span className="scan-corner corner-bottom-right" /><span className="scan-center" />
          </div>
          <h1>BUSCANDO ESCUDO...</h1>
          <div className="ar-regions" aria-label="Seleccionar región">
            {regions.map((region) => <button className={activeRegion === region ? 'ar-region is-active' : 'ar-region'} type="button" onClick={() => setActiveRegion(region)} key={region}>{region}</button>)}
          </div>
          <button className="camera-button" type="button" onClick={() => navigate('/ar/escudos/anclado')} aria-label="Tomar foto del escudo"><span className="camera-icon" aria-hidden="true">▣</span></button>
        </section>
        <BottomNav activeTab="ar" onTabChange={() => {}} />
      </main>
    )
  }

  return (
    <main className="ar-mode-shell shield-mode-shell">
      <PageHeader title="AR" backTo="/ar" />
      <section className="ar-mode-content" aria-label="Escudo anclado en realidad aumentada">
        <div className="ar-mode-toolbar">
          <button className="mode-back" type="button" onClick={() => navigate('/ar')} aria-label="Volver a seleccionar modo">←</button>
          <span className="mode-chip is-active">ANCLADO</span>
          <span className="mode-chip">YANKEES - {activeRegion}</span>
        </div>

        <div className={`anchored-shield ${isAnimating ? 'is-animating' : ''}`} aria-label="Escudo de Yankees con jugador de béisbol">
          <div className="shield-logo">NY</div>
          <div className="shield-player" aria-hidden="true"><span className="player-head" /><span className="player-body" /><span className="player-bat" /></div>
        </div>

        <p className="ar-description">El jugador aparece en pose sobre el escudo impreso, con el escudo 3D del club flotando detrás como telón. La narración se reproduce en voz alta.</p>
        <div className="ar-action-row">
          <button type="button" onClick={() => setIsAnimating((current) => !current)}>💡<span>ANIMAR</span></button>
          <button type="button">▶<span>VIDEO</span></button>
          <button type="button">★<span>EFECTOS</span></button>
          <button type="button">●<span>FOTO</span></button>
        </div>
        <div className="ar-regions" aria-label="Seleccionar región">
          {regions.map((region) => <button className={activeRegion === region ? 'ar-region is-active' : 'ar-region'} type="button" onClick={() => setActiveRegion(region)} key={region}>{region}</button>)}
        </div>
        <button className="team-sheet-button" type="button">VER FICHA COMPLETA<br />DEL EQUIPO</button>
      </section>
      <BottomNav activeTab="ar" onTabChange={() => {}} />
    </main>
  )
}
