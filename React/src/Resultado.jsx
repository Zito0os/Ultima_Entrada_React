import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Icono from './Icono'
import { TROFEOS_TOTAL } from './almacen/esquema'
import { finals } from './finalsData'
import { useJugador } from './almacen/useJugador'

const LANZAMIENTOS = 3

export default function Resultado() {
  const { finalId } = useParams()
  const navigate = useNavigate()
  const { perfil, acciones } = useJugador()
  const final = finals.find((item) => item.id === finalId)
  const pagado = useRef(false)
  const [yaLaTenia] = useState(() => Boolean(perfil.finales[finalId]?.ganada))

  useEffect(() => {
    if (!final || pagado.current) {
      return
    }
    pagado.current = true
    acciones.guardarFinal(final.id, true, LANZAMIENTOS)
  }, [final, acciones])

  if (!final) {
    return null
  }

  return (
    <main className="result-shell-final">
      <section className="result-content-final" aria-labelledby="result-title">
        <p className="result-kicker">TROFEO</p>
        <h1 id="result-title">DESBLOQUEADO</h1>
        <div className="result-trophy"><Icono nombre="trofeo" /></div>

        <div className="result-final-summary">
          <h2>SERIE MUNDIAL<br />{final.year}</h2>
          <div className="result-stats">
            <div><strong>+{yaLaTenia ? 0 : 50}</strong><span>MONEDAS</span></div>
            <div><strong>{LANZAMIENTOS}</strong><span>LANZAMIENTOS</span></div>
            <div><strong>{perfil.trofeos.length}/{TROFEOS_TOTAL}</strong><span>COLECCIÓN</span></div>
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
