import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import PageHeader from './PageHeader'
import { finals } from './finalsData'
import { sonar } from './sonidos'

// La barra recorre 0 a 100 y regresa. El centro es el contacto perfecto.
const PASO = 2.2
const CENTRO = 50
// Media anchura de la zona buena, en la misma escala de la barra
const ZONA = 16
const ZONAS = [
  { limite: 6, tipo: 'jonron', texto: '¡JONRÓN!' },
  { limite: ZONA, tipo: 'hit', texto: 'HIT' },
  { limite: 28, tipo: 'foul', texto: 'FOUL' },
]

export default function JuegoFinal() {
  const { finalId } = useParams()
  const navigate = useNavigate()
  const final = finals.find((item) => item.id === finalId)

  const [posicion, setPosicion] = useState(0)
  const [bolas, setBolas] = useState(0)
  const [strikes, setStrikes] = useState(0)
  const [outs, setOuts] = useState(0)
  const [carreras, setCarreras] = useState(0)
  const [bases, setBases] = useState([false, true, false])
  const [turnos, setTurnos] = useState(0)
  const [jugada, setJugada] = useState('')
  const [fin, setFin] = useState(null)
  const direccion = useRef(1)

  // La barra corre con un intervalo y no con rAF: asi sigue viva aunque la
  // pestana pierda el foco a medio turno
  useEffect(() => {
    if (fin) {
      return undefined
    }
    const reloj = setInterval(() => {
      setPosicion((actual) => {
        let siguiente = actual + PASO * direccion.current
        if (siguiente >= 100) {
          siguiente = 100
          direccion.current = -1
        } else if (siguiente <= 0) {
          siguiente = 0
          direccion.current = 1
        }
        return siguiente
      })
    }, 16)
    return () => clearInterval(reloj)
  }, [fin])

  if (!final) {
    return null
  }

  const terminar = (ganada) => {
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
      // Basta una carrera para cerrar la entrada
      terminar(true)
    }
  }

  const nuevoTurno = () => {
    setBolas(0)
    setStrikes(0)
    setTurnos(turnos + 1)
  }

  const sumarStrike = (texto) => {
    if (strikes + 1 >= 3) {
      setJugada('¡PONCHADO!')
      sonar('fallo')
      const total = outs + 1
      setOuts(total)
      nuevoTurno()
      if (total >= 3) {
        terminar(false)
      }
      return
    }
    setStrikes(strikes + 1)
    setJugada(texto)
  }

  const sumarBola = () => {
    if (bolas + 1 >= 4) {
      setJugada('BASE POR BOLAS')
      nuevoTurno()
      avanzar(1)
      return
    }
    setBolas(bolas + 1)
    setJugada('BOLA')
  }

  const batear = () => {
    if (fin) {
      return
    }
    sonar('bate')
    const distancia = Math.abs(posicion - CENTRO)
    const zona = ZONAS.find((item) => distancia <= item.limite)

    if (!zona) {
      sumarStrike('ABANICASTE')
      return
    }
    if (zona.tipo === 'foul') {
      // El foul nunca hace el tercer strike
      setStrikes(strikes >= 2 ? strikes : strikes + 1)
      setJugada('FOUL')
      return
    }
    setJugada(zona.texto)
    nuevoTurno()
    avanzar(zona.tipo === 'jonron' ? 4 : 1)
  }

  // Dejar pasar: si el lanzamiento venia en la zona es strike cantado
  const dejarPasar = () => {
    if (fin) {
      return
    }
    if (Math.abs(posicion - CENTRO) <= ZONA) {
      sumarStrike('STRIKE CANTADO')
    } else {
      sumarBola()
    }
  }

  const irAlResultado = () => navigate(`/finales/${final.id}/resultado`, {
    state: { ganada: fin === 'ganada', lanzamientos: turnos },
  })

  return (
    <main className="batting-shell">
      <PageHeader title="" backTo={`/finales/${final.id}`} />

      <section className="batting-content" aria-label="Juego de bateo">
        <div className="batting-scoreboard">
          <div><strong>{final.home}</strong><b>{carreras}</b><strong>{final.away}</strong><b>1</b></div>
          <div className="scoreboard-inning"><span>ENTRADA</span><strong>9</strong></div>
          <div><span>B - S - O</span><strong>{bolas} - {strikes} - {outs}</strong></div>
          <span className="scoreboard-diamond" aria-hidden="true">◆</span>
        </div>

        <div className="bases-vista" aria-label={`Corredores en base: ${bases.filter(Boolean).length}`}>
          {['1B', '2B', '3B'].map((nombre, indice) => (
            <span className={bases[indice] ? 'base es-ocupada' : 'base'} key={nombre}>{nombre}</span>
          ))}
        </div>

        <div className="baseball-field" aria-hidden="true">
          <div className="field-cloud cloud-one" />
          <div className="field-cloud cloud-two" />
          <div className="field-lights light-left" />
          <div className="field-lights light-right" />
          <div className="field-scoreboard" />
          <div className="field-fence" />
          <div className="field-grass" />
          <div className="field-dirt" />
          <div className="field-mound" />
          <div className="field-home" />
          <div className="field-bat" />
        </div>

        <p className="batting-jugada" role="status">{jugada || 'ESPERA EL LANZAMIENTO'}</p>

        <div className="barra-tiempo" aria-label="Barra de tiempo de bateo">
          <div className="barra-zona" />
          <div className="barra-aguja" style={{ left: `${posicion}%` }} />
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
            <button className="bat-button" type="button" onClick={batear}>BATEAR</button>
            <button className="bat-button es-pasar" type="button" onClick={dejarPasar}>DEJAR PASAR</button>
          </div>
        )}
      </section>
    </main>
  )
}
