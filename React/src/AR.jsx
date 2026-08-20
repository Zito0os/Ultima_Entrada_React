import { useNavigate } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'

export default function AR() {
  const navigate = useNavigate()

  return (
    <main className="ar-shell">
      <PageHeader title="AR" backTo="/" />

      <section className="ar-selector-content" aria-label="Seleccionar modo de realidad aumentada">
        <p className="ar-selector-kicker">ELIGE UNA EXPERIENCIA</p>
        <button className="ar-mode-choice shield-choice" type="button" onClick={() => navigate('/ar/escudos')}>
          <span>♢</span>
          <strong>ESCUDOS</strong>
          <small>Explora equipos y jugadores en realidad aumentada</small>
        </button>
        <button className="ar-mode-choice card-choice" type="button" onClick={() => navigate('/ar/tarjetas')}>
          <span>▣</span>
          <strong>TARJETAS</strong>
          <small>Descubre el contenido de tus tarjetas coleccionables</small>
        </button>
      </section>

      <BottomNav activeTab="ar" onTabChange={() => {}} />
    </main>
  )
}
