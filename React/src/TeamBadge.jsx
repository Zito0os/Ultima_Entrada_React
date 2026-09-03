import { rutaEscudo } from './escudosData'

export default function TeamBadge({ team }) {
  return (
    <div className="team-badge" aria-hidden="true">
      <img src={rutaEscudo(team.id)} alt="" />
    </div>
  )
}
