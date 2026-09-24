import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'
import RelojTrivia from './RelojTrivia'
import TrofeoGanado from './TrofeoGanado'
import { rutaEscudo } from './escudosData'
import { teams } from './teamsData'
import { PREGUNTAS_POR_EPOCA, buscarEpoca, epocasDe } from './triviaData'
import { buscarTrofeo } from './trofeosData'
import { sonar } from './sonidos'
import { useJugador } from './almacen/useJugador'

const SEGUNDOS = 20
// Desde aqui el reloj se pone rojo y el tic se vuelve urgente
const URGENCIA = 5
const letras = ['A', 'B', 'C', 'D']

function epocasPerfectas(perfil, teamId) {
  const avance = perfil.trivia[teamId] || {}
  return epocasDe(teamId).filter((epoca) => (avance[epoca.id]?.mejor || 0) === PREGUNTAS_POR_EPOCA).length
}

// Elegir equipo: solo el escudo, en grande
function Menu() {
  const navigate = useNavigate()
  const { perfil } = useJugador()

  return (
    <main className="trivia-shell">
      <PageHeader title="TRIVIA" backTo="/" />
      <section className="trivia-menu-content" aria-label="Seleccionar equipo">
        <h2>Elige un equipo</h2>
        <p className="trivia-menu-nota">Tres épocas por equipo, cinco preguntas cada una. La ronda perfecta da trofeo, y las tres épocas dan el del club.</p>
        <div className="trivia-escudos">
          {teams.map((team) => {
            const listas = epocasPerfectas(perfil, team.id)
            return (
              <button className="trivia-escudo" type="button" onClick={() => navigate(`/trivia/${team.id}`)} key={team.id}>
                <img src={rutaEscudo(team.id)} alt="" aria-hidden="true" />
                <span>{team.name}</span>
                <small>{listas} de {epocasDe(team.id).length}</small>
              </button>
            )
          })}
        </div>
      </section>
      <BottomNav activeTab="inicio" onTabChange={() => {}} />
    </main>
  )
}

// Elegir epoca dentro de un equipo
function Epocas({ team }) {
  const navigate = useNavigate()
  const { perfil } = useJugador()
  const avance = perfil.trivia[team.id] || {}
  const epocas = epocasDe(team.id)
  const completo = epocas.every((epoca) => (avance[epoca.id]?.mejor || 0) === PREGUNTAS_POR_EPOCA)

  return (
    <main className="trivia-shell">
      <PageHeader title="TRIVIA" backTo="/trivia" />
      <section className="trivia-epocas-content" aria-label={`Épocas de ${team.name}`}>
        <div className="trivia-epocas-cabecera">
          <img src={rutaEscudo(team.id)} alt="" aria-hidden="true" />
          <h2>{team.name}</h2>
          {completo && <b className="trivia-completo">LAS TRES ÉPOCAS</b>}
        </div>
        <ul className="trivia-epocas">
          {epocas.map((epoca) => {
            const mejor = avance[epoca.id]?.mejor || 0
            const perfecta = mejor === PREGUNTAS_POR_EPOCA
            return (
              <li key={epoca.id}>
                <button className={perfecta ? 'trivia-epoca is-perfecta' : 'trivia-epoca'} type="button" onClick={() => navigate(`/trivia/${team.id}/${epoca.id}`)}>
                  <span className="trivia-epoca__anios">{epoca.anios}</span>
                  <strong>{epoca.nombre}</strong>
                  <span className="trivia-epoca__avance">{mejor} de {PREGUNTAS_POR_EPOCA}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      <BottomNav activeTab="inicio" onTabChange={() => {}} />
    </main>
  )
}

function Resumen({ team, epoca, aciertos, total, onRepetir }) {
  const navigate = useNavigate()
  const { perfil, acciones } = useJugador()
  const perfecta = aciertos === total
  const pagado = useRef(false)
  const [visible, setVisible] = useState(false)
  // Los trofeos que ya tenia al entrar: lo que aparezca despues es nuevo
  const [previos] = useState(perfil.trofeos)
  const [cerrado, setCerrado] = useState(false)

  // El premio se paga al llegar al resumen, no al responder cada pregunta
  useEffect(() => {
    if (pagado.current) {
      return
    }
    pagado.current = true
    acciones.guardarTrivia(team.id, epoca.id, aciertos, total, epocasDe(team.id).map((item) => item.id))
    sonar(perfecta ? 'acierto' : 'carta')
  }, [acciones, team.id, epoca.id, aciertos, total, perfecta])

  // Las medallas entran una por una: el efecto solo enciende la clase
  useEffect(() => {
    const temporizador = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(temporizador)
  }, [])

  const trofeoEquipo = perfil.trofeos.includes(`trivia-${team.id}`)
  const nuevos = perfil.trofeos.filter((id) => !previos.includes(id))
  const trofeo = nuevos.length && !cerrado ? buscarTrofeo(nuevos[nuevos.length - 1]) : null

  if (trofeo) {
    return (
      <main className="trivia-shell">
        <PageHeader title="TRIVIA" backTo={`/trivia/${team.id}`} />
        <section className="trivia-resumen">
          <TrofeoGanado trofeo={trofeo} onCerrar={() => setCerrado(true)} />
        </section>
        <BottomNav activeTab="inicio" onTabChange={() => {}} />
      </main>
    )
  }

  return (
    <main className="trivia-shell">
      <PageHeader title="TRIVIA" backTo={`/trivia/${team.id}`} />
      <section className={visible ? 'trivia-resumen es-visible' : 'trivia-resumen'} aria-labelledby="resumen-titulo">
        <p className="trivia-resumen-kicker">{perfecta ? 'RONDA PERFECTA' : 'RONDA TERMINADA'}</p>
        <h1 id="resumen-titulo">{aciertos} DE {total}</h1>
        <p className="trivia-resumen-equipo">{team.name} · {epoca.nombre}</p>
        <div className="trivia-resumen-premios">
          <div><strong>+{aciertos * 5}</strong><span>MONEDAS</span></div>
          <div><strong>{perfecta ? '+30' : '0'}</strong><span>BONO</span></div>
          <div><strong>{perfecta ? '1' : '0'}</strong><span>TROFEO</span></div>
        </div>
        {perfecta && trofeoEquipo && <p className="trivia-resumen-club">Completaste las tres épocas de {team.name}</p>}
        <button className="next-question-button" type="button" onClick={onRepetir}>JUGAR OTRA VEZ</button>
        <button className="trivia-resumen-salir" type="button" onClick={() => navigate(`/trivia/${team.id}`)}>ELEGIR OTRA ÉPOCA</button>
      </section>
      <BottomNav activeTab="inicio" onTabChange={() => {}} />
    </main>
  )
}

function Ronda({ team, epoca }) {
  const preguntas = epoca.preguntas
  const [indice, setIndice] = useState(0)
  const [elegida, setElegida] = useState(null)
  const [aciertos, setAciertos] = useState(0)
  const [restante, setRestante] = useState(SEGUNDOS)
  const [terminada, setTerminada] = useState(false)

  const respondida = elegida !== null

  useEffect(() => {
    if (respondida || terminada) {
      return undefined
    }
    const reloj = setTimeout(() => {
      if (restante <= 1) {
        setRestante(0)
        setElegida(-1)
        sonar('tiempo')
        return
      }
      sonar(restante <= URGENCIA + 1 ? 'ticUrgente' : 'tic')
      setRestante(restante - 1)
    }, 1000)
    return () => clearTimeout(reloj)
  }, [restante, respondida, terminada])

  const reiniciar = () => {
    setIndice(0)
    setElegida(null)
    setAciertos(0)
    setRestante(SEGUNDOS)
    setTerminada(false)
  }

  if (terminada) {
    return <Resumen team={team} epoca={epoca} aciertos={aciertos} total={preguntas.length} onRepetir={reiniciar} />
  }

  const pregunta = preguntas[indice]

  const responder = (opcion) => {
    if (respondida) {
      return
    }
    setElegida(opcion)
    sonar(opcion === pregunta.correcta ? 'acierto' : 'fallo')
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
      <PageHeader title={team.name} backTo={`/trivia/${team.id}`} />
      {/* La llave reinicia las animaciones de entrada en cada pregunta */}
      <section className="trivia-question-content" aria-label={`Trivia de ${team.name}`} key={indice}>
        <div className="trivia-progress" aria-label={`Pregunta ${indice + 1} de ${preguntas.length}`}>
          {preguntas.map((_, numero) => (
            <span className={numero < indice ? 'is-hecha' : numero === indice ? 'is-current' : ''} key={numero} />
          ))}
        </div>

        <div className="trivia-tablero">
          <RelojTrivia restante={restante} total={SEGUNDOS} urgente={!respondida && restante <= URGENCIA} detenido={respondida} />
          <div className="question-card">
            <span>PREGUNTA {indice + 1} DE {preguntas.length}</span>
            <h2>{pregunta.pregunta}</h2>
          </div>
        </div>

        <div className="answer-list">
          {pregunta.opciones.map((opcion, numero) => (
            <button className={claseOpcion(numero)} style={{ '--i': numero }} type="button" onClick={() => responder(numero)} disabled={respondida} key={opcion}>
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

export default function Trivia() {
  const { teamId, epocaId } = useParams()
  const team = teams.find((item) => item.id === teamId)

  if (!team) {
    return <Menu />
  }
  const epoca = epocaId ? buscarEpoca(team.id, epocaId) : null
  if (!epoca) {
    return <Epocas team={team} />
  }

  // La llave arranca la ronda desde cero al cambiar de epoca
  return <Ronda team={team} epoca={epoca} key={epoca.id} />
}
