import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'
import TablaAnotacion from './TablaAnotacion'
import TeamBadge from './TeamBadge'
import { teams } from './teamsData'

const detailTabs = ['HISTORIA', 'ESTADÍSTICAS', 'VIDEOS']
const statsTabs = ['BATEO', 'PITCHEO', 'FRANQUICIA']

export default function EquipoDetalle() {
  const { teamId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('HISTORIA')
  const [statsTab, setStatsTab] = useState('BATEO')
  const [leaderAbierto, setLeaderAbierto] = useState(null)
  const team = teams.find((item) => item.id === teamId)

  if (!team) {
    return <Navigate to="/equipos" replace />
  }

  const leaders = team.lideres[statsTab]
  const mayor = Math.max(...leaders.map((leader) => leader.value))

  return (
    <main className="team-detail-shell">
      <PageHeader title={team.name} backTo="/equipos" />

      <section className="team-detail-content" aria-labelledby="team-detail-title">
        <div className="team-detail-identity">
          <TeamBadge team={team} />
          <h2 id="team-detail-title">{team.name}</h2>
        </div>
        <p className="team-location">{team.founded} · {team.stadium} · {team.city}</p>

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
            <TablaAnotacion serie={team.serie} />

            <div className="statistics-subtabs" role="tablist" aria-label="Tipo de estadísticas">
              {statsTabs.map((tab) => (
                <button className={statsTab === tab ? 'statistics-subtab is-active' : 'statistics-subtab'} type="button" role="tab" aria-selected={statsTab === tab} onClick={() => { setStatsTab(tab); setLeaderAbierto(null) }} key={tab}>
                  {tab}
                </button>
              ))}
            </div>

            <div className="leaders-block">
              <h2>LÍDERES HISTÓRICOS</h2>
              {leaders.map((leader) => (
                <button className="leader-row" type="button" onClick={() => setLeaderAbierto((actual) => actual === leader.name ? null : leader.name)} aria-expanded={leaderAbierto === leader.name} key={leader.name}>
                  <div className="leader-label"><strong>{leader.name}</strong><span>{leader.value}</span></div>
                  <div className="leader-track"><span style={{ width: `${Math.round((leader.value / mayor) * 100)}%` }} /></div>
                  {leaderAbierto === leader.name && (
                    <p className="leader-detalle">{leader.value} {leader.unidad} con {team.name}. Dato simulado para el prototipo.</p>
                  )}
                </button>
              ))}
            </div>
          </article>
        )}

        {activeTab === 'VIDEOS' && (
          <article className="videos-panel">
            <h2>VIDEOS</h2>
            <p>Clips históricos de {team.name}. Al abrir uno entras al reproductor con filtros.</p>
            <div className="era-video-list">
              {[1, 2, 3].map((numero) => (
                <button className={`era-video era-video-${numero}`} type="button" onClick={() => navigate('/videos')} aria-label={`Reproducir video ${numero} de ${team.name}`} key={numero}>
                  <span aria-hidden="true">▶</span>
                </button>
              ))}
            </div>
          </article>
        )}

        <div className="team-detail-salidas">
          <button className="team-detail-salida" type="button" onClick={() => navigate('/ar/escudos')}>VER EN AR</button>
          <button className="team-detail-salida is-principal" type="button" onClick={() => navigate('/finales')}>JUGAR SU FINAL</button>
        </div>
      </section>

      <BottomNav activeTab="equipos" onTabChange={() => {}} />
    </main>
  )
}
