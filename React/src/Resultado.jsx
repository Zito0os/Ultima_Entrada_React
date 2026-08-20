import { useNavigate, useParams } from 'react-router-dom'

import { finals } from './finalsData'

export default function Resultado() {
  const { finalId } = useParams()
  const navigate = useNavigate()
  const final = finals.find((item) => item.id === finalId)

  if (!final) {
    return null
  }

  return (
    <main className="result-shell-final">
      <section className="result-content-final" aria-labelledby="result-title">
        <p className="result-kicker">TROFEO</p>
        <h1 id="result-title">DESBLOQUEADO</h1>
        <div className="result-trophy" aria-hidden="true">♜</div>

        <div className="result-final-summary">
          <h2>SERIE MUNDIAL<br />{final.year}</h2>
          <div className="result-stats">
            <div><strong>+50</strong><span>MONEDAS</span></div>
            <div><strong>3</strong><span>LANZAMIENTOS</span></div>
            <div><strong>3/24</strong><span>COLECCIÓN</span></div>
          </div>
        </div>

        <button className="result-store-button" type="button" onClick={() => navigate('/sobres')}>
          IR A LA TIENDA DE<br />SOBRES
        </button>
        <div className="result-actions">
          <button className="result-share-button" type="button">COMPARTIR<br />FOTO</button>
          <button className="result-next-button" type="button" onClick={() => navigate('/finales')}>
            REGRESAR A<br />FINALES
          </button>
        </div>
      </section>
    </main>
  )
}
