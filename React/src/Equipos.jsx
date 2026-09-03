import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'
import TeamBadge from './TeamBadge'
import { regions, teams } from './teamsData'

export default function Equipos() {
  const [activeRegion, setActiveRegion] = useState('TODAS')
  const [busqueda, setBusqueda] = useState('')
  const navigate = useNavigate()

  const texto = busqueda.trim().toLowerCase()
  const visibles = teams.filter((team) => (activeRegion === 'TODAS' || team.region === activeRegion)
    && (!texto || [team.name, team.stadium, team.city].some((campo) => campo.toLowerCase().includes(texto))))

  return (
    <main className="teams-shell">
      <PageHeader title="EQUIPOS" />
      <header className="teams-tools-header">
        <div className="team-tools">
          <label className="team-search">
            <span className="sr-only">Buscar equipo, estadio o ciudad</span>
            <input type="search" placeholder="Buscar equipo, estadio o ciudad" value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} />
            <span aria-hidden="true">⌕</span>
          </label>

          <div className="region-filters" aria-label="Filtrar equipos por región">
            {regions.map((region) => (
              <button className={activeRegion === region ? 'region-filter is-active' : 'region-filter'} type="button" key={region} onClick={() => setActiveRegion(region)}>
                {region}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="teams-list" aria-label="Lista de equipos">
        {visibles.map((team) => (
          <article className="team-card" key={team.id}>
            <TeamBadge team={team} />
            <div className="team-copy">
              <h2>{team.name}</h2>
              <p>{team.titles} TÍTULOS</p>
              <button className="team-link" type="button" onClick={() => navigate(`/equipos/${team.id}`)}>
                LEER MÁS <span aria-hidden="true">-&gt;</span>
              </button>
            </div>
          </article>
        ))}
      </section>

      <BottomNav activeTab="equipos" onTabChange={() => {}} />
    </main>
  )
}
