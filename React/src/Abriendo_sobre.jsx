import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'
import { packs } from './packsData'

export default function AbriendoSobre() {
  const { packId } = useParams()
  const navigate = useNavigate()
  const pack = packs.find((item) => item.id === packId)
  const [cardNumber, setCardNumber] = useState(3)

  if (!pack) {
    return <Navigate to="/sobres" replace />
  }

  return (
    <main className="opening-pack-shell">
      <PageHeader title="" backTo="/sobres" />

      <section className="opening-pack-content" aria-label={`Abriendo ${pack.name}`}>
        <div className="card-progress">
          <strong>CARTA&nbsp; {cardNumber} DE 5</strong>
          <div><span /><span /><span /><span /><span /></div>
        </div>

        <button className={`opening-card opening-card-${pack.tone}`} type="button" aria-label="Voltear carta">
          <span>JUGADOR</span>
          <strong>LANZADOR</strong>
          <small>CLEVELAND - ESPECIAL</small>
        </button>

        <div className="card-rarity">
          <strong>ESPECIAL</strong>
          <span>NUEVA</span>
        </div>

        <button className="next-card-button" type="button" onClick={() => setCardNumber((current) => current >= 5 ? 1 : current + 1)}>
          SIGUIENTE CARTA
        </button>
        <button className="view-card-ar-button" type="button" onClick={() => navigate('/ar/tarjetas')}>
          VER EN AR
        </button>
      </section>

      <BottomNav activeTab="inicio" onTabChange={() => {}} />
    </main>
  )
}
