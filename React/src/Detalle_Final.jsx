import { Navigate, useNavigate, useParams } from 'react-router-dom'

import BottomNav from './Navigation'
import EscudoFinal from './EscudoFinal'
import PageHeader from './PageHeader'
import { buscarFinal, finalAbierta } from './finalsData'
import { useJugador } from './almacen/useJugador'

export default function DetalleFinal() {
  const { finalId } = useParams()
  const navigate = useNavigate()
  const { perfil } = useJugador()
  const final = buscarFinal(finalId)

  if (!final) {
    return <Navigate to="/finales" replace />
  }

  const ganada = Boolean(perfil.finales[final.id]?.ganada)
  const abierta = finalAbierta(final, perfil.trofeos.length)
  const enBase = final.bases.filter(Boolean).length

  return (
    <main className="final-detail-shell">
      <PageHeader title="" backTo="/finales" />

      <section className="final-detail-content" aria-label={`Detalle de la final de ${final.year}`}>
        <div className="final-detail-matchup">
          <EscudoFinal equipo={final.local} tamano="grande" />
          <strong>VS</strong>
          <EscudoFinal equipo={final.rival} tamano="grande" />
        </div>

        <h1 className="final-detail-titulo">{final.serie}</h1>
        <p className="final-detail-relato">{final.descripcion}</p>

        <div className="final-situacion">
          <div>
            <span>{final.local.abrev}</span>
            <strong>{final.carreras.local}</strong>
          </div>
          <div>
            <span>{final.rival.abrev}</span>
            <strong>{final.carreras.rival}</strong>
          </div>
          <div>
            <span>OUTS</span>
            <strong>{final.outs}</strong>
          </div>
          <div>
            <span>EN BASE</span>
            <strong>{enBase}</strong>
          </div>
        </div>

        <p className="final-detail-inning">{final.situacion}</p>

        {ganada && <p className="final-detail-ganada">Ya ganaste esta serie. Puedes volver a jugarla.</p>}

        <button className="play-final-button" type="button" disabled={!abierta} onClick={() => navigate(`/finales/${final.id}/jugar`)}>
          {abierta ? (ganada ? 'JUGAR OTRA VEZ' : 'JUGAR') : `NECESITAS ${final.abre} TROFEOS`}
        </button>
      </section>

      <BottomNav activeTab="inicio" onTabChange={() => {}} />
    </main>
  )
}
