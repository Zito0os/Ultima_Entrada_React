import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'
import { rutaEscudo } from './escudosData'
import { teams } from './teamsData'
import { triviaPorEquipo } from './triviaData'
import { useJugador } from './almacen/useJugador'

const SEGUNDOS = 12
const letras = ['A', 'B', 'C', 'D']

function Menu() {
  const navigate = useNavigate()
  const { perfil } = useJugador()

  return (
    <main className="trivia-shell">
      <PageHeader title="TRIVIA" backTo="/" />
      <section className="trivia-menu-content" aria-label="Seleccionar trivia">
        <h2>Elige un equipo</h2>
        <p className="trivia-menu-nota">Cinco preguntas con temporizador. Una ronda perfecta entrega el trofeo de conocimiento del club.</p>
        <div className="trivia-modes">
          {teams.map((team) => {
            const total = triviaPorEquipo[team.id]?.length || 0
            const hecho = perfil.trivia[team.id]
            return (
              <button className={total ? 'trivia-mode' : 'trivia-mode is-pendiente'} type="button" disabled={!total} onClick={() => navigate(`/trivia/${team.id}`)} key={team.id}>
                <img src={rutaEscudo(team.id)} alt="" aria-hidden="true" />
                <span>{team.name}</span>
                <small>{!total ? 'próximamente' : hecho ? `mejor ${hecho.mejor}/${total}` : `${total} preguntas`}</small>
              </button>
            )
          })}
        </div>
      </section>
      <BottomNav activeTab="inicio" onTabChange={() => {}} />
    </main>
  )
}

function Resumen({ team, aciertos, total, onRepetir }) {
  const navigate = useNavigate()
  const { acciones } = useJugador()
  const perfecta = aciertos === total
  const pagado = useRef(false)

  // El premio se paga al llegar al resumen, no al responder cada pregunta
  useEffect(() => {
    if (pagado.current) {
      return
    }
    pagado.current = true
    acciones.guardarTrivia(team.id, aciertos, total)
  }, [acciones, team.id, aciertos, total])

  return (
    <main className="trivia-shell">
      <PageHeader title="TRIVIA" backTo="/trivia" />
      <section className="trivia-resumen" aria-labelledby="resumen-titulo">
        <p className="trivia-resumen-kicker">{perfecta ? 'RONDA PERFECTA' : 'RONDA TERMINADA'}</p>
        <h1 id="resumen-titulo">{aciertos} DE {total}</h1>
        <p className="trivia-resumen-equipo">{team.name}</p>
        <div className="trivia-resumen-premios">
          <div><strong>+{aciertos * 5}</strong><span>MONEDAS</span></div>
          <div><strong>{perfecta ? '+30' : '0'}</strong><span>BONO</span></div>
          <div><strong>{perfecta ? '1' : '0'}</strong><span>TROFEO</span></div>
        </div>
        <button className="next-question-button" type="button" onClick={onRepetir}>JUGAR OTRA VEZ</button>
        <button className="trivia-resumen-salir" type="button" onClick={() => navigate('/trivia')}>ELEGIR OTRO EQUIPO</button>
      </section>
      <BottomNav activeTab="inicio" onTabChange={() => {}} />
    </main>
  )
}

export default function Trivia() {
  const { mode } = useParams()
  const team = teams.find((item) => item.id === mode)
  const preguntas = team ? triviaPorEquipo[team.id] : null

  const [indice, setIndice] = useState(0)
  const [elegida, setElegida] = useState(null)
  const [aciertos, setAciertos] = useState(0)
  const [restante, setRestante] = useState(SEGUNDOS)
  const [terminada, setTerminada] = useState(false)

  const respondida = elegida !== null

  useEffect(() => {
    if (!preguntas || respondida || terminada) {
      return
    }
    const reloj = setTimeout(() => {
      if (restante <= 1) {
        setRestante(0)
        setElegida(-1)
        return
      }
      setRestante(restante - 1)
    }, 1000)
    return () => clearTimeout(reloj)
  }, [restante, respondida, terminada, preguntas])

  if (!team || !preguntas) {
    return <Menu />
  }

  const reiniciar = () => {
    setIndice(0)
    setElegida(null)
    setAciertos(0)
    setRestante(SEGUNDOS)
    setTerminada(false)
  }

  if (terminada) {
    return <Resumen team={team} aciertos={aciertos} total={preguntas.length} onRepetir={reiniciar} />
  }

  const pregunta = preguntas[indice]

  const responder = (opcion) => {
    if (respondida) {
      return
    }
    setElegida(opcion)
    if (opcion === pregunta.correcta) {
      setAciertos((total) => total + 1)
    }
  }

  const siguiente = () => {
    if (indice + 1 >= preguntas.length) {
      setTerminada(true)
      return
    }
    setIndice((actual) => actual + 1)
    setElegida(null)
    setRestante(SEGUNDOS)
  }

  const claseOpcion = (opcion) => {
    if (!respondida) {
      return 'answer-button'
    }
    if (opcion === pregunta.correcta) {
      return 'answer-button is-correcta'
    }
    if (opcion === elegida) {
      return 'answer-button is-fallada'
    }
    return 'answer-button is-apagada'
  }

  return (
    <main className="trivia-shell">
      <PageHeader title="TRIVIA" backTo="/trivia" />
      <section className="trivia-question-content" aria-label={`Trivia de ${team.name}`}>
        <div className="trivia-progress" aria-label={`Pregunta ${indice + 1} de ${preguntas.length}`}>
          {preguntas.map((_, numero) => (
            <span className={numero < indice ? 'is-hecha' : numero === indice ? 'is-current' : ''} key={numero} />
          ))}
        </div>

        <div className="question-card">
          <span>PREGUNTA {indice + 1}&nbsp;&nbsp;-&nbsp;&nbsp;{respondida ? '—' : `${restante} S`}</span>
          <h2>{pregunta.pregunta}</h2>
        </div>

        <div className="answer-list">
          {pregunta.opciones.map((opcion, numero) => (
            <button className={claseOpcion(numero)} type="button" onClick={() => responder(numero)} disabled={respondida} key={opcion}>
              <span>{letras[numero]}</span><strong>{opcion}</strong>
            </button>
          ))}
        </div>

        {respondida && (
          <div className={elegida === pregunta.correcta ? 'correct-answer' : 'correct-answer is-fallada'} role="status">
            <strong>{elegida === pregunta.correcta ? 'CORRECTO +5 MONEDAS' : elegida === -1 ? 'SE ACABÓ EL TIEMPO' : 'RESPUESTA INCORRECTA'}</strong>
            <span>{pregunta.nota}</span>
          </div>
        )}

        <button className="next-question-button" type="button" onClick={siguiente} disabled={!respondida}>
          {indice + 1 >= preguntas.length ? 'VER RESULTADO' : 'SIGUIENTE PREGUNTA'}
        </button>
      </section>
      <BottomNav activeTab="inicio" onTabChange={() => {}} />
    </main>
  )
}
