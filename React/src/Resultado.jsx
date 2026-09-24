import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Icono from './Icono'
import TrofeoGanado from './TrofeoGanado'
import { TOTAL_TROFEOS, buscarTrofeo } from './trofeosData'
import { finals } from './finalsData'
import { useJugador } from './almacen/useJugador'


export default function Resultado() {
  const { finalId } = useParams()
  const navigate = useNavigate()
  const { perfil, acciones } = useJugador()
  // El desenlace viaja desde el minijuego: sin el se asume derrota
  const { state } = useLocation()
  const ganada = state?.ganada === true
  const lanzamientos = state?.lanzamientos ?? 0
  const final = finals.find((item) => item.id === finalId)
  const pagado = useRef(false)
  const [yaLaTenia] = useState(() => Boolean(perfil.finales[finalId]?.ganada))
  const [cerrado, setCerrado] = useState(false)

  useEffect(() => {
    if (!final || pagado.current) {
      return
    }
    pagado.current = true
    acciones.guardarFinal(final.id, ganada, lanzamientos)
  }, [final, acciones, ganada, lanzamientos])

  if (!final) {
    return null
  }

  // La copa en 3D sale solo la primera vez que se gana esta final
  const trofeo = ganada && !yaLaTenia && !cerrado ? buscarTrofeo(`final-${final.id}`) : null
  if (trofeo) {
    return (
      <main className="result-shell-final">
        <section className="result-content-final">
          <TrofeoGanado nombre={trofeo.nombre} pista={trofeo.pista} onCerrar={() => setCerrado(true)} />
        </section>
      </main>
    )
  }

  return (
    <main className="result-shell-final">
      <section className="result-content-final" aria-labelledby="result-title">
        <p className="result-kicker">{ganada ? 'TROFEO' : 'SIN TROFEO'}</p>
        <h1 id="result-title">{ganada ? 'DESBLOQUEADO' : 'SERÁ A LA PRÓXIMA'}</h1>
        <div className={ganada ? 'result-trophy' : 'result-trophy es-apagado'}><Icono nombre="trofeo" /></div>

        <div className="result-final-summary">
          <h2>SERIE MUNDIAL<br />{final.year}</h2>
          <div className="result-stats">
            <div><strong>+{ganada && !yaLaTenia ? 50 : 0}</strong><span>MONEDAS</span></div>
            <div><strong>{lanzamientos}</strong><span>TURNOS</span></div>
            <div><strong>{perfil.trofeos.length}/{TOTAL_TROFEOS}</strong><span>COLECCIÓN</span></div>
          </div>
        </div>

        <button className="result-store-button" type="button" onClick={() => navigate('/sobres')}>
          IR A LA TIENDA DE<br />SOBRES
        </button>
        <div className="result-actions">
          <button className="result-share-button" type="button" onClick={() => navigate('/galeria')}>COMPARTIR<br />FOTO</button>
          <button className="result-next-button" type="button" onClick={() => navigate('/finales')}>
            REGRESAR A<br />FINALES
          </button>
        </div>
      </section>
    </main>
  )
}
