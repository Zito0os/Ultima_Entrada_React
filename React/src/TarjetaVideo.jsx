import Icono from './Icono'
import { rutaMiniatura } from './videosData'

// Portada grande con los datos del clip en chico abajo
export default function TarjetaVideo({ clip, detalle, onAbrir }) {
  return (
    <button className="video-card" type="button" onClick={onAbrir}>
      <span className="video-card__portada">
        <img src={rutaMiniatura(clip.id)} alt="" loading="lazy" decoding="async" />
        <span className="video-card__play"><Icono nombre="reproducir" size={16} /></span>
        {clip.duracion && <span className="video-card__duracion">{clip.duracion}</span>}
      </span>
      <strong className="video-card__titulo">{clip.titulo}</strong>
      {detalle.filter(Boolean).map((linea) => (
        <span className="video-card__meta" key={linea}>{linea}</span>
      ))}
    </button>
  )
}
