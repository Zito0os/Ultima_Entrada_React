import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import BottomNav from './Navigation'
import Icono from './Icono'
import PageHeader from './PageHeader'

export default function Tarjetas() {
  const navigate = useNavigate()
  const location = useLocation()
  const [cardSide, setCardSide] = useState('front')

  if (!location.pathname.endsWith('/anclado')) {
    return (
      <main className="ar-scan-shell">
        <PageHeader title="AR" backTo="/ar" />
        <section className="ar-scan-content" aria-label="Escáner de tarjetas">
          <div className="scan-mode-toolbar">
            <button className="mode-back" type="button" onClick={() => navigate('/ar')} aria-label="Volver a seleccionar modo"><Icono nombre="flecha" /></button>
            <span className="mode-chip is-active">TARJETAS</span>
            <span className="mode-chip">5 TARJETAS</span>
          </div>
          <div className="scan-frame" aria-hidden="true">
            <span className="scan-corner corner-top-left" /><span className="scan-corner corner-top-right" />
            <span className="scan-corner corner-bottom-left" /><span className="scan-corner corner-bottom-right" /><span className="scan-center" />
          </div>
          <h1>BUSCANDO TARJETA...</h1>
          <div className="ar-regions" aria-label="Seleccionar tipo de tarjeta">
            {['COMÚN', 'ESPECIAL', 'HOLO'].map((region, index) => <button className={index === 0 ? 'ar-region is-active' : 'ar-region'} type="button" key={region}>{region}</button>)}
          </div>
          <button className="camera-button" type="button" onClick={() => navigate('/ar/tarjetas/anclado')} aria-label="Tomar foto de la tarjeta"><span className="camera-icon" aria-hidden="true">▣</span></button>
        </section>
        <BottomNav activeTab="ar" onTabChange={() => {}} />
      </main>
    )
  }

  return (
    <main className="ar-mode-shell card-mode-shell">
      <PageHeader title="AR" backTo="/ar" />
      <section className="ar-mode-content card-mode-content" aria-label="Tarjeta holográfica en realidad aumentada">
        <div className="ar-mode-toolbar">
          <button className="mode-back" type="button" onClick={() => navigate('/ar')} aria-label="Volver a seleccionar modo"><Icono nombre="flecha" /></button>
          <span className="mode-chip is-active">ANCLADO</span>
          <span className="mode-chip">TARJETA HOLOGRÁFICA</span>
        </div>

        <button className={`holographic-card ${cardSide === 'back' ? 'is-back' : ''}`} type="button" onClick={() => setCardSide((side) => side === 'front' ? 'back' : 'front')} aria-label="Voltear tarjeta">
          <div className="card-player" aria-hidden="true"><span className="card-head" /><span className="card-body" /><span className="card-bat" /></div>
          <strong>{cardSide === 'front' ? 'YANKEES' : 'ZITO COLLECTION'}</strong>
        </button>

        <div className="card-tools" aria-label="Herramientas de tarjeta">
          <button type="button" onClick={() => setCardSide('front')}>⟳</button>
          <button className="herramienta-bate" type="button" aria-label="Animar el bateo"><Icono nombre="bate" /></button>
          <button type="button">●</button>
          <button type="button">▣</button>
        </div>
        <button className="change-card-button" type="button" onClick={() => setCardSide('back')}>CAMBIAR TARJETA</button>
      </section>
      <BottomNav activeTab="ar" onTabChange={() => {}} />
    </main>
  )
}
