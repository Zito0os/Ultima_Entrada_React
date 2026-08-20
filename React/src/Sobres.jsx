import { useNavigate } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'

const packs = [
  { id: 'bronze', name: 'SOBRE BRONCE', description: '3 cartas comunes', price: 100, tone: 'bronze' },
  { id: 'silver', name: 'SOBRE PLATA', description: '5 cartas - 1 especial', price: 250, tone: 'silver' },
  { id: 'gold', name: 'SOBRE ORO', description: '5 cartas - 1 holográfica', price: 500, tone: 'gold' },
]

export default function Sobres() {
  const navigate = useNavigate()

  return (
    <main className="packs-shell">
      <PageHeader title="TIENDA" backTo="/" />

      <section className="packs-content" aria-label="Tienda de sobres">
        <div className="coins-summary">
          <span>TUS MONEDAS</span>
          <strong>340</strong>
          <p>GANA MÁS BATEANDO FINALES</p>
        </div>

        <h2 className="packs-heading">SOBRES DISPONIBLES</h2>
        <section className="packs-list" aria-label="Sobres disponibles">
          {packs.map((pack) => (
            <button className="pack-card" type="button" key={pack.id} onClick={() => navigate(`/sobres/${pack.id}`)}>
              <span className={`pack-swatch pack-swatch-${pack.tone}`} aria-hidden="true" />
              <span className="pack-copy">
                <strong>{pack.name}</strong>
                <small>{pack.description}</small>
              </span>
              <span className={pack.price === 500 ? 'pack-price is-expensive' : 'pack-price'}>{pack.price}</span>
            </button>
          ))}
        </section>
      </section>

      <BottomNav activeTab="inicio" onTabChange={() => {}} />
    </main>
  )
}
