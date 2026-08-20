import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'

const videoFilters = ['PIXELADO', 'ORIGINAL', 'DESENFOQUE', 'AJUSTE DE COLOR', 'SUAVIZADO', 'PASTEL']

const relatedVideos = [
  { id: 'reaccion', title: 'Reacción del juego', tone: 'blue' },
  { id: 'jugadas', title: 'Mejores jugadas', tone: 'violet' },
  { id: 'historia', title: 'Historia del béisbol', tone: 'green' },
]

export default function Videos() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('PIXELADO')
  const [intensity, setIntensity] = useState(60)
  const [isPlaying, setIsPlaying] = useState(false)
  const [saved, setSaved] = useState(false)

  return (
    <main className="videos-shell">
      <PageHeader title="VIDEOS" backTo={eventId ? `/historia/${eventId}` : '/historia'} />

      <section className="videos-content" aria-label="Editor de videos">
        <button className={`video-preview ${isPlaying ? 'is-playing' : ''}`} type="button" onClick={() => setIsPlaying((playing) => !playing)} aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}>
          <span className="play-icon" aria-hidden="true">{isPlaying ? '❚❚' : '▶'}</span>
        </button>

        <p className="filter-heading">FILTRO APLICADO</p>
        <div className="video-filters" aria-label="Filtros de video">
          {videoFilters.map((filter) => (
            <button className={activeFilter === filter ? 'video-filter is-active' : 'video-filter'} type="button" onClick={() => setActiveFilter(filter)} key={filter}>
              {filter}
            </button>
          ))}
        </div>

        <div className="intensity-panel">
          <div className="intensity-label"><strong>INTENSIDAD</strong><span>{intensity}%</span></div>
          <input type="range" min="0" max="100" value={intensity} onChange={(event) => setIntensity(event.target.value)} aria-label="Intensidad del filtro" />
          <small>TAMAÑO DEL BLOQUE 4PX</small>
        </div>

        <button className="save-clip-button" type="button" onClick={() => setSaved((isSaved) => !isSaved)}>
          {saved ? 'CLIP GUARDADO' : 'GUARDAR CLIP'}
        </button>

        <p className="more-videos-heading">MAS VIDEOS</p>
        <section className="related-videos" aria-label="Más videos">
          {relatedVideos.map((video) => (
            <button className={`related-video related-${video.tone}`} type="button" key={video.id} onClick={() => navigate(eventId ? `/videos/${eventId}` : '/videos')} aria-label={video.title}>
              <span className="related-play" aria-hidden="true">▶</span>
            </button>
          ))}
        </section>
      </section>

      <BottomNav activeTab="historia" onTabChange={() => {}} />
    </main>
  )
}
