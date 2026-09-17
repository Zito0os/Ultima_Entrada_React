import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Icono from './Icono'
import { TOTAL_TROFEOS } from './trofeosData'
import { useJugador } from './almacen/useJugador'

// Fuera del componente a proposito: la cabecera se vuelve a montar en cada
// pantalla, y asi el pulso solo sale cuando el numero cambio de verdad
let saldoVisto = null
let trofeosVistos = null

export default function PageHeader({ title, backTo, rightLabel }) {
  const navigate = useNavigate()
  const { perfil } = useJugador()
  const ganados = perfil.trofeos.length
  const subioSaldo = saldoVisto !== null && saldoVisto !== perfil.monedas
  const subioTrofeo = trofeosVistos !== null && trofeosVistos !== ganados

  useEffect(() => {
    saldoVisto = perfil.monedas
    trofeosVistos = ganados
  })

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
            <span className={subioSaldo ? 'coins es-nuevo' : 'coins'} key={perfil.monedas}><span className="coin-icon"><Icono nombre="moneda" /></span> {perfil.monedas}</span>
            <span className={subioTrofeo ? 'trophies es-nuevo' : 'trophies'} key={ganados}><span className="trophy-icon"><Icono nombre="trofeo" /></span> {ganados}/{TOTAL_TROFEOS}</span>
          </div>
        )}
      </div>
    </header>
  )
}
