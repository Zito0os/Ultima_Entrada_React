import { useNavigate } from 'react-router-dom'

export default function PageHeader({ title, backTo }) {
  const navigate = useNavigate()

  return (
    <header className="page-header">
      <div className="page-header-inner">
        {backTo ? (
          <button className="page-header-back" type="button" onClick={() => navigate(backTo)} aria-label="Regresar">
            ←
          </button>
        ) : null}
        <h1>{title}</h1>
        <div className="page-header-stats" aria-label="Progreso del jugador">
          <span className="coins"><span className="coin-icon">✦</span> 340</span>
          <span className="trophies"><span className="trophy-icon">♜</span> 3/24</span>
        </div>
      </div>
    </header>
  )
}
