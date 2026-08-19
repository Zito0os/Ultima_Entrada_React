import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'
import TeamBadge from './TeamBadge'
import { teams } from './teamsData'

const detailTabs = ['HISTORIA', 'ESTADÍSTICAS', 'VIDEOS']

const historicalLeaders = [
  { name: 'BABE RUTH', value: 659, width: '78%' },
  { name: 'MICKEY MANTLE', value: 536, width: '60%' },
  { name: 'LOU GEHRIG', value: 493, width: '48%' },
]

export default function EquipoDetalle() {
  const { teamId } = useParams()
  const [activeTab, setActiveTab] = useState('HISTORIA')
  const team = teams.find((item) => item.id === teamId)
  const opponent = teams.find((item) => item.id !== teamId) ?? team

  if (!team) {
    return <Navigate to="/equipos" replace />
  }

  return (
    <main className="team-detail-shell">
      <PageHeader title={activeTab} backTo="/equipos" />

      <section className="team-detail-content" aria-labelledby="team-detail-title">
        {activeTab === 'HISTORIA' && (
          <>
            <div className="team-detail-identity">
              <TeamBadge team={team} />
              <h2 id="team-detail-title">{team.name}</h2>
            </div>
            <p className="team-location">{team.founded} · {team.stadium} · {team.city}</p>
          </>
        )}

        {activeTab === 'ESTADÍSTICAS' && (
          <section className="statistics-matchup" aria-label="Estadísticas del enfrentamiento">
            <div className="matchup-logos">
              <TeamBadge team={team} />
              <strong>VS</strong>
              <TeamBadge team={opponent} />
            </div>
            <p className="series-title">SERIE MUNDIAL 1996 · JUEGO 6</p>
            <div className="inning-scoreboard">
              <p>1 2 3 4 5 6 7 8 9</p>
              <div><strong>{team.abbreviation}</strong><span>0 0 1 0 0 0 0 0 1</span></div>
              <div><strong>{opponent.abbreviation}</strong><span>0 0 3 0 0 0 0 0 1</span></div>
            </div>
          </section>
        )}

        <div className="detail-tabs" role="tablist" aria-label="Información del equipo">
          {detailTabs.map((tab) => (
            <button className={activeTab === tab ? 'detail-tab is-active' : 'detail-tab'} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)} key={tab}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'HISTORIA' && (
          <article className="history-panel">
            <div className="team-stat-grid" aria-label="Estadísticas principales">
              <div className="team-stat"><strong>{team.titles}</strong><span>SERIES</span></div>
              <div className="team-stat"><strong>{team.banners}</strong><span>BANDERINES</span></div>
              <div className="team-stat"><strong>{team.firstTitle}</strong><span>1ER TÍTULO</span></div>
            </div>
            <h2>HISTORIA</h2>
            <p>{team.history}</p>
          </article>
        )}

        {activeTab === 'ESTADÍSTICAS' && (
          <article className="leaders-panel">
            <div className="statistics-subtabs" role="tablist" aria-label="Tipo de estadísticas">
              <button className="statistics-subtab is-active" type="button" role="tab" aria-selected="true">BATEO</button>
              <button className="statistics-subtab" type="button" role="tab" aria-selected="false">PITCHEO</button>
              <button className="statistics-subtab" type="button" role="tab" aria-selected="false">FRANQUICIA</button>
            </div>
            <h2>LÍDERES HISTÓRICOS</h2>
            {historicalLeaders.map((leader) => (
              <div className="leader-row" key={leader.name}>
                <div className="leader-label"><strong>{leader.name}</strong><span>{leader.value}</span></div>
                <div className="leader-track"><span style={{ width: leader.width }} /></div>
              </div>
            ))}
          </article>
        )}

        {activeTab === 'VIDEOS' && (
          <article className="videos-panel">
            <h2>VIDEOS</h2>
            <p>Los videos destacados de {team.name} estarán disponibles próximamente.</p>
          </article>
        )}
      </section>

      <BottomNav activeTab="equipos" onTabChange={() => {}} />
    </main>
  )
}