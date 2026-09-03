import { useNavigate } from 'react-router-dom'

import Icono from './Icono'
import { TROFEOS_TOTAL } from './almacen/esquema'
import { useJugador } from './almacen/useJugador'

export default function PageHeader({ title, backTo, rightLabel }) {
  const navigate = useNavigate()
  const { perfil } = useJugador()

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
            <span className="coins"><span className="coin-icon">✦</span> {perfil.monedas}</span>
            <span className="trophies"><span className="trophy-icon"><Icono nombre="trofeo" /></span> {perfil.trofeos.length}/{TROFEOS_TOTAL}</span>
          </div>
        )}
      </div>
    </header>
  )
}
