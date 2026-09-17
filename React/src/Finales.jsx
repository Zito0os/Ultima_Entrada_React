import { useNavigate } from 'react-router-dom'

import BottomNav from './Navigation'
import EscudoFinal from './EscudoFinal'
import Icono from './Icono'
import PageHeader from './PageHeader'
import { finalAbierta, finals } from './finalsData'
import { useJugador } from './almacen/useJugador'

export default function Finales() {
  const navigate = useNavigate()
  const { perfil } = useJugador()
  const ganados = perfil.trofeos.length
  const completadas = finals.filter((final) => perfil.finales[final.id]?.ganada).length

  return (
    <main className="finals-shell">
      <PageHeader title="FINALES" backTo="/" />

      <section className="finals-content" aria-label="Finales históricas">
        <p className="finals-resumen">
          <strong>{completadas}</strong> de {finals.length} series ganadas
        </p>

        {finals.map((final) => {
          const ganada = Boolean(perfil.finales[final.id]?.ganada)
          const abierta = finalAbierta(final, ganados)
          const faltan = final.abre - ganados

          return (
            <button
              className={`final-card${ganada ? ' es-ganada' : ''}${abierta ? '' : ' es-bloqueada'}`}
              type="button"
              key={final.id}
              disabled={!abierta}
              onClick={() => navigate(`/finales/${final.id}`)}
            >
              <span className="final-anio">{final.year}</span>

              <span className="final-equipos">
                <EscudoFinal equipo={final.local} />
                <b>VS</b>
                <EscudoFinal equipo={final.rival} />
              </span>

              <span className="final-texto">
                <strong>{final.local.ciudad} vs {final.rival.ciudad}</strong>
                <small>{final.situacion}</small>
              </span>

              <span className={ganada ? 'final-marca es-ganada' : 'final-marca'}>
                {abierta
                  ? <Icono nombre="trofeo" />
                  : <span className="final-candado">{faltan} 🔒</span>}
              </span>
            </button>
          )
        })}
      </section>

      <BottomNav activeTab="inicio" onTabChange={() => {}} />
    </main>
  )
}
