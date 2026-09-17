import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import PageHeader from './PageHeader'
import { buscarFinal } from './finalsData'
import { sonar } from './sonidos'

// El lanzamiento avanza de 0 a 100 mientras la pelota viaja al home.
const PASO = 2
const TIC = 28
// Donde esta la pelota cuando cruza el plato: ahi es el contacto perfecto
const CONTACTO = 72
const ZONAS = [
  { limite: 5, tipo: 'jonron', texto: '¡JONRÓN!' },
  { limite: 13, tipo: 'hit', texto: 'HIT' },
  { limite: 22, tipo: 'foul', texto: 'FOUL' },
]
// Cada cuantos lanzamientos viene uno fuera de la zona
const PROBABILIDAD_ZONA = 0.65

export default function JuegoFinal() {
  const { finalId } = useParams()
  const navigate = useNavigate()
  const final = buscarFinal(finalId)

  const [avance, setAvance] = useState(0)
  const [fase, setFase] = useState('esperando')
  const [lanzamiento, setLanzamiento] = useState(0)
  const [enZona, setEnZona] = useState(true)
  const [pose, setPose] = useState(1)
  const [bolas, setBolas] = useState(0)
  const [strikes, setStrikes] = useState(0)
  const [outs, setOuts] = useState(() => final?.outs ?? 0)
  const [carreras, setCarreras] = useState(0)
  const [bases, setBases] = useState(() => final?.bases ?? [false, false, false])
  const [turnos, setTurnos] = useState(0)
  const [jugada, setJugada] = useState('')
  const [fin, setFin] = useState(null)
  const [reglas, setReglas] = useState(true)

  const lanzar = () => {
    setEnZona(Math.random() < PROBABILIDAD_ZONA)
    setAvance(0)
    setPose(1)
    setLanzamiento((n) => n + 1)
    setFase('lanzando')
  }

  const terminar = (ganada) => {
    setFase('fin')
    setFin(ganada ? 'ganada' : 'perdida')
    sonar(ganada ? 'acierto' : 'fallo')
  }

  // Todos avanzan el mismo numero de bases; el que pasa de tercera anota
  const avanzar = (basesGanadas) => {
    const nuevas = [false, false, false]
    let anotadas = 0
    const corredores = [0]
    bases.forEach((ocupada, indice) => {
      if (ocupada) {
        corredores.push(indice + 1)
      }
    })
    corredores.forEach((base) => {
      const destino = base + basesGanadas
      if (destino >= 4) {
        anotadas += 1
      } else {
        nuevas[destino - 1] = true
      }
    })
    setBases(nuevas)
    if (anotadas > 0) {
      setCarreras(carreras + anotadas)
      terminar(true)
      return true
    }
    return false
  }

  const nuevoTurno = () => {
    setBolas(0)
    setStrikes(0)
    setTurnos(turnos + 1)
  }

  const sumarStrike = (titulo, motivo) => {
    setJugada(`${titulo} · ${motivo}`)
    if (strikes + 1 >= 3) {
      sonar('fallo')
      const total = outs + 1
      setOuts(total)
      nuevoTurno()
      setJugada(`¡PONCHADO! · ${motivo}`)
      if (total >= 3) {
        terminar(false)
        return
      }
    } else {
      setStrikes(strikes + 1)
    }
    setFase('esperando')
  }

  const sumarBola = () => {
    if (bolas + 1 >= 4) {
      setJugada('BASE POR BOLAS · Cuatro fuera de la zona.')
      nuevoTurno()
      if (avanzar(1)) {
        return
      }
    } else {
      setBolas(bolas + 1)
      setJugada('BOLA · Venía fuera de la zona, bien dejada.')
    }
    setFase('esperando')
  }

  const batear = () => {
    if (fase !== 'lanzando') {
      return
    }
    sonar('bate')
    setPose(2)
    const distancia = Math.abs(avance - CONTACTO)
    const zona = ZONAS.find((item) => distancia <= item.limite)
    const tarde = avance > CONTACTO

    if (!zona) {
      sumarStrike('ABANICASTE', tarde ? 'Le pegaste tarde.' : 'Le pegaste muy pronto.')
      return
    }
    if (zona.tipo === 'foul') {
      setStrikes(strikes >= 2 ? strikes : strikes + 1)
      setJugada(`FOUL · Casi: ${tarde ? 'un poco tarde' : 'un poco pronto'}.`)
      setFase('esperando')
      return
    }
    setPose(3)
    setJugada(`${zona.texto} · Contacto en el momento justo.`)
    nuevoTurno()
    if (!avanzar(zona.tipo === 'jonron' ? 4 : 1)) {
      setFase('esperando')
    }
  }

  // Un intervalo por lanzamiento. Al llegar al final lo resuelve ahi mismo:
  // dentro del temporizador si se puede cambiar el estado, en el cuerpo del
  // efecto no. Los contadores no se mueven durante el vuelo de la pelota, asi
  // que lo que captura el cierre sigue siendo valido cuando termina.
  useEffect(() => {
    if (fase !== 'lanzando') {
      return undefined
    }
    let t = 0
    const reloj = setInterval(() => {
      t += PASO
      setAvance(t)
      if (t >= 100) {
        clearInterval(reloj)
        if (enZona) {
          sumarStrike('STRIKE CANTADO', 'La dejaste pasar y venía en la zona.')
        } else {
          sumarBola()
        }
      }
    }, TIC)
    return () => clearInterval(reloj)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase, lanzamiento])

  if (!final) {
    return <Navigate to="/finales" replace />
  }

  const irAlResultado = () => navigate(`/finales/${final.id}/resultado`, {
    state: { ganada: fin === 'ganada', lanzamientos: turnos },
  })

  // La pelota sale del monticulo y crece conforme se acerca
  const t = avance / 100
  const estiloPelota = {
    top: `${18 + t * 58}%`,
    left: `${44 + Math.sin(t * Math.PI) * (enZona ? 2 : 9)}%`,
    transform: `scale(${0.35 + t * 1.5})`,
    opacity: fase === 'lanzando' ? 1 : 0,
  }

  return (
    <main className="batting-shell">
      <PageHeader title="" backTo={`/finales/${final.id}`} />

      <section className="batting-content" aria-label="Juego de bateo">
        <div className="batting-scoreboard">
          <div><strong>{final.local.abrev}</strong><b>{final.carreras.local + carreras}</b><strong>{final.rival.abrev}</strong><b>{final.carreras.rival}</b></div>
          <div className="scoreboard-inning"><span>ENTRADA</span><strong>9</strong></div>
          <div><span>B - S - O</span><strong>{bolas} - {strikes} - {outs}</strong></div>
        </div>

        <div className="bases-vista" aria-label={`Corredores en base: ${bases.filter(Boolean).length}`}>
          {['1B', '2B', '3B'].map((nombre, indice) => (
            <span className={bases[indice] ? 'base es-ocupada' : 'base'} key={nombre}>{nombre}</span>
          ))}
        </div>

        <div className="baseball-field">
          <div className="field-cloud cloud-one" aria-hidden="true" />
          <div className="field-cloud cloud-two" aria-hidden="true" />
          <div className="field-lights light-left" aria-hidden="true" />
          <div className="field-lights light-right" aria-hidden="true" />
          <div className="field-fence" aria-hidden="true" />
          <div className="field-grass" aria-hidden="true" />
          <div className="field-dirt" aria-hidden="true" />
          <div className="field-mound" aria-hidden="true" />
          <div className="field-home" aria-hidden="true" />

          <span className="pelota" style={estiloPelota} aria-hidden="true" />

          <img
            className={`bateador es-pose-${pose}`}
            src={`${import.meta.env.BASE_URL}bateador/pose-${pose}.png`}
            alt=""
            aria-hidden="true"
          />
        </div>

        <p className="batting-jugada" role="status">
          {jugada || (fase === 'lanzando' ? 'BATEA CUANDO LA PELOTA LLEGUE AL PLATO' : 'LISTO PARA EL LANZAMIENTO')}
        </p>

        <div className="barra-tiempo" aria-label="Tiempo del lanzamiento">
          <div className="barra-zona" />
          <div className="barra-perfecta" />
          <div className="barra-aguja" style={{ left: `${avance}%`, opacity: fase === 'lanzando' ? 1 : .25 }} />
        </div>

        {fin ? (
          <div className="batting-fin">
            <strong>{fin === 'ganada' ? '¡GANASTE LA ENTRADA!' : 'TE QUEDASTE SIN OUTS'}</strong>
            <button className="bat-button" type="button" onClick={irAlResultado}>
              {fin === 'ganada' ? 'VER RECOMPENSA' : 'VER RESULTADO'}
            </button>
          </div>
        ) : (
          <div className="batting-acciones">
            <button className="bat-button" type="button" onClick={batear} disabled={fase !== 'lanzando'}>
              BATEAR
            </button>
            <button className="bat-button es-pasar" type="button" onClick={lanzar} disabled={fase === 'lanzando'}>
              {lanzamiento === 0 ? 'EMPEZAR' : 'SIGUIENTE'}
            </button>
          </div>
        )}
      </section>

      {reglas && (
        <div className="modal-backdrop" role="presentation" onClick={() => setReglas(false)}>
          <section className="challenge-modal" role="dialog" aria-modal="true" aria-labelledby="reglas-bateo" onClick={(e) => e.stopPropagation()}>
            <span className="modal-kicker">{final.serie}</span>
            <h2 id="reglas-bateo">CÓMO SE<br />BATEA</h2>
            <ol className="rules-list">
              <li>Toca SIGUIENTE y la pelota sale del montículo hacia ti.</li>
              <li>Toca BATEAR cuando la aguja entre en la franja verde. El centro amarillo es jonrón.</li>
              <li>Si la dejas pasar y venía en la zona, es strike cantado. Si venía fuera, es bola.</li>
              <li>Tres strikes son un out. Con tres outs se acaba. Una carrera y ganas la entrada.</li>
            </ol>
            <button className="button button-primary modal-action" type="button" onClick={() => setReglas(false)}>ENTENDIDO</button>
          </section>
        </div>
      )}
    </main>
  )
}
