import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'

const filters = ['TODOS', 'DÉCADA', 'EQUIPO']

const trophies = [
  { year: 1975, unlocked: true },
  { year: 1986, unlocked: true },
  { year: 1991, unlocked: true },
  { year: 1991, unlocked: true },
  { year: 1991, unlocked: true },
  { year: 1991, unlocked: false },
  { year: 1991, unlocked: false },
  { year: 1991, unlocked: false },
  { year: 1991, unlocked: false },
]

function TrophyCard({ trophy }) {
  return (
    <article className={trophy.unlocked ? 'trophy-card is-unlocked' : 'trophy-card is-locked'}>
      <span className="trophy-mark" aria-hidden="true">♜</span>
      <strong>{trophy.year}</strong>
    </article>
  )
}

export default function Perfil() {
  const [activeFilter, setActiveFilter] = useState('TODOS')
  const navigate = useNavigate()

  return (
    <main className="profile-shell">
      <PageHeader title="MI PERFIL" backTo="/" />

      <section className="profile-content" aria-label="Progreso de trofeos">
        <button className="gallery-entry" type="button" onClick={() => navigate('/galeria')}>
          <strong>GALERÍA</strong>
          <span aria-hidden="true">➜</span>
        </button>

        <div className="profile-summary">
          <div>
            <span>TROFEOS</span>
            <strong>9<span>/24</span></strong>
          </div>
          <div className="streak-summary">
            <span>RACHA</span>
            <strong>4</strong>
          </div>
          <div className="progress-track" aria-label="9 de 24 trofeos desbloqueados">
            <span />
          </div>
        </div>

        <div className="profile-filters" role="tablist" aria-label="Filtrar trofeos">
          {filters.map((filter) => (
            <button className={activeFilter === filter ? 'profile-filter is-active' : 'profile-filter'} type="button" role="tab" aria-selected={activeFilter === filter} onClick={() => setActiveFilter(filter)} key={filter}>
              {filter}
            </button>
          ))}
        </div>

        <section className="trophy-grid" aria-label="Colección de trofeos">
          {trophies.map((trophy, index) => (
            <TrophyCard trophy={trophy} key={`${trophy.year}-${index}`} />
          ))}
        </section>
      </section>

      <BottomNav activeTab="perfil" onTabChange={() => {}} />
    </main>
  )
}
