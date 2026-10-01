import { Suspense, lazy, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'
import TablaAnotacion from './TablaAnotacion'
import TarjetaVideo from './TarjetaVideo'
import TeamBadge from './TeamBadge'
import { historiaDe } from './historiaEquipos'
import { teams } from './teamsData'
import { videosDeEquipo } from './videosData'

// three.js solo se descarga al abrir una ficha
const EscudoGiratorio = lazy(() => import('./EscudoGiratorio'))

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
  const historia = historiaDe(team.id)
  const videos = videosDeEquipo(team.id)

  // Sin clips propios la pestana lleva directo al catalogo de jugadas
  const elegirPestana = (tab) => {
    if (tab === 'VIDEOS' && !videos.length) {
      navigate('/mejores-jugadas')
      return
    }
    setActiveTab(tab)
  }
  const mayor = Math.max(...leaders.map((leader) => leader.value))

  return (
    <main className="team-detail-shell">
      <PageHeader title={team.name} backTo="/equipos" />

      <section className="team-detail-content" aria-labelledby="team-detail-title">
        <div className="team-detail-identity">
          <Suspense fallback={<TeamBadge team={team} />}>
            <EscudoGiratorio team={team} key={team.id} />
          </Suspense>
          <h2 id="team-detail-title">{team.name}</h2>
        </div>
        <p className="team-location">{team.founded} · {team.stadium} · {team.city}</p>

        <div className="detail-tabs" role="tablist" aria-label="Información del equipo">
          {detailTabs.map((tab) => (
            <button className={activeTab === tab ? 'detail-tab is-active' : 'detail-tab'} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => elegirPestana(tab)} key={tab}>
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
            {historia.parrafos.map((parrafo) => <p className="historia-parrafo" key={parrafo.slice(0, 24)}>{parrafo}</p>)}

            {historia.momentos.length > 0 && (
              <>
                <h3 className="historia-subtitulo">MOMENTOS CLAVE</h3>
                <ol className="historia-momentos">
                  {historia.momentos.map(([anio, texto]) => (
                    <li key={anio}><strong>{anio}</strong><span>{texto}</span></li>
                  ))}
                </ol>
              </>
            )}

            {historia.leyendas.length > 0 && (
              <>
                <h3 className="historia-subtitulo">LEYENDAS</h3>
                <ul className="historia-leyendas">
                  {historia.leyendas.map((nombre) => <li key={nombre}>{nombre}</li>)}
                </ul>
              </>
            )}
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
            <p>Clips donde aparece {team.name}. Al abrir uno entras al reproductor con filtros.</p>
            <div className="plays-list equipo-videos">
              {videos.map((clip) => (
                <TarjetaVideo
                  clip={clip}
                  detalle={[clip.anio ? `${clip.anio} · ${clip.evento}` : clip.periodo, clip.equipos]}
                  onAbrir={() => navigate(clip.ruta)}
                  key={clip.id}
                />
              ))}
            </div>
            <button className="team-detail-salida equipo-mas-videos" type="button" onClick={() => navigate('/mejores-jugadas')}>VER TODOS LOS VIDEOS</button>
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
