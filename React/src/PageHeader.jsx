import { useNavigate } from 'react-router-dom'

import Icono from './Icono'

export default function PageHeader({ title, backTo, rightLabel }) {
  const navigate = useNavigate()

  return (
    <header className="page-header">
      <div className="page-header-inner">
        {backTo ? (
          <button className="page-header-back" type="button" onClick={() => navigate(backTo)} aria-label="Regresar">
            <Icono nombre="flecha" />
          </button>
        ) : null}
        <h1>{title}</h1>
        {rightLabel ? (
          <span className="page-header-label">{rightLabel}</span>
        ) : (
          <div className="page-header-stats" aria-label="Progreso del jugador">
            <span className="coins"><span className="coin-icon">✦</span> 340</span>
            <span className="trophies"><span className="trophy-icon"><Icono nombre="trofeo" /></span> 3/24</span>
          </div>
        )}
      </div>
    </header>
  )
}
