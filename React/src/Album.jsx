import { useState } from 'react'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'
import Icono from './Icono'

const filters = ['TODAS', 'COMÚN', 'ESPECIAL', 'HOLO']

const cards = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  featured: index === 0 || index === 5,
}))

export default function Album() {
  const [activeFilter, setActiveFilter] = useState('TODAS')

  return (
    <main className="album-shell">
      <PageHeader title="ALBUM" backTo="/perfil" rightLabel="12/45" />

      <section className="album-content" aria-label="Colección de tarjetas">
        <div className="album-summary">
          <div>
            <span>COLECCIÓN</span>
            <strong>12<span>/45</span></strong>
          </div>
          <div className="holographic-summary">
            <span>HOLOGRÁFICAS</span>
            <strong>2<span>/15</span></strong>
          </div>
          <div className="album-progress" aria-label="12 de 45 tarjetas coleccionadas">
            <span />
          </div>
        </div>

        <div className="album-filters" role="tablist" aria-label="Filtrar tarjetas">
          {filters.map((filter) => (
            <button className={activeFilter === filter ? 'album-filter is-active' : 'album-filter'} type="button" role="tab" aria-selected={activeFilter === filter} onClick={() => setActiveFilter(filter)} key={filter}>
              {filter}
            </button>
          ))}
        </div>

        <section className="album-grid" aria-label="Tarjetas del álbum">
          {cards.map((card) => (
            <button className={card.featured ? 'album-card is-featured' : 'album-card'} type="button" key={card.id} aria-label={`Tarjeta ${card.id}`}>
              {card.featured && <span className="album-card-mark"><Icono nombre="cartas" /></span>}
            </button>
          ))}
        </section>

        <button className="ar-card-button" type="button">
          <span className="ar-card-icon"><Icono nombre="ar" /></span>
          VER AR DE LA TARJETA
        </button>
      </section>

      <BottomNav activeTab="perfil" onTabChange={() => {}} />
    </main>
  )
}
