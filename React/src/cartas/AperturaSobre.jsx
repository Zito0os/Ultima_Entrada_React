import { useRef, useState } from 'react'

import { prefiereMenosMovimiento } from './movimiento'
import FinalCarta from './FinalCarta'
import PilaCartas from './PilaCartas'
import ResumenSobre from './ResumenSobre'
import SobreSellado from './SobreSellado'
import { sonar } from '../sonidos'
import './apertura.css'

// Tienen que coincidir con las animaciones de apertura.css
// La comun suena como siempre; la especial y la holografica, distinto
function sonidoDe(carta) {
  return carta?.rareza === 'comun' ? 'carta' : carta?.rareza || 'carta'
}

const DURACION_RASGADO = 900
const DURACION_VOLTEO = 450

// Solo anima: las cartas ya se guardaron al comprar. Si el usuario cierra a
// la mitad, no pierde nada.
export default function AperturaSobre({ sobre, cartas, monedasExtra, onAlbum, onOtro }) {
  const [fase, setFase] = useState('sellado')
  const [vistas, setVistas] = useState(0)
  // Los temporizadores leen la fase de aqui: si el usuario salto al resumen
  // mientras corrian, no deben regresarlo a la mitad de la apertura
  const faseActual = useRef('sellado')
  const total = cartas.length
  const ultima = cartas[total - 1]
  const conFinal = ultima.rareza !== 'comun'
  const espera = (ms) => (prefiereMenosMovimiento() ? 0 : ms)

  const irA = (nueva) => {
    faseActual.current = nueva
    setFase(nueva)
  }

  const avanzar = () => {
    if (vistas >= total) {
      irA('resumen')
      return
    }
    const siguientes = vistas + 1
    setVistas(siguientes)
    sonar(sonidoDe(cartas[vistas]))
    if (siguientes === total && conFinal) {
      setTimeout(() => {
        if (faseActual.current === 'revelando') {
          sonar('acierto')
          irA('final')
        }
      }, espera(DURACION_VOLTEO))
    }
  }

  const abrir = () => {
    sonar('sobre')
    irA('rasgando')
    setTimeout(() => {
      if (faseActual.current !== 'rasgando') {
        return
      }
      irA('revelando')
      // La de arriba de la pila sale boca arriba
      setVistas(1)
      sonar(sonidoDe(cartas[0]))
    }, espera(DURACION_RASGADO))
  }

  if (fase === 'resumen') {
    return (
      <main className="apertura">
        <ResumenSobre cartas={cartas} monedasExtra={monedasExtra} onAlbum={onAlbum} onOtro={onOtro} />
      </main>
    )
  }

  const bloqueada = fase !== 'revelando'
  const actual = cartas[Math.max(0, vistas - 1)]

  return (
    <main className={`apertura es-${fase}`}>
      <header className="apertura__barra">
        <strong>{fase === 'sellado' ? sobre.nombre : `CARTA ${Math.max(1, vistas)} DE ${total}`}</strong>
        {fase !== 'sellado' && (
          <button className="apertura__saltar" type="button" onClick={() => irA('resumen')}>SALTAR</button>
        )}
      </header>

      <div className="apertura__escena">
        {fase !== 'sellado' && <PilaCartas cartas={cartas} vistas={vistas} bloqueada={bloqueada} onSiguiente={avanzar} />}
        {(fase === 'sellado' || fase === 'rasgando') && (
          <SobreSellado sobre={sobre} abierto={fase === 'rasgando'} onAbrir={abrir} />
        )}
      </div>

      <footer className="apertura__pie">
        {fase === 'revelando' && vistas > 0 && (
          <p className={`apertura__rareza rareza--${actual.rareza}`}>
            {actual.rarezaNombre}{actual.nueva ? ' · NUEVA' : ''}
          </p>
        )}
        {fase === 'revelando' && <p className="apertura__pista">Desliza la carta a un lado</p>}
      </footer>

      <p className="solo-lector" aria-live="polite">
        {vistas > 0 ? `Carta ${vistas} de ${total}: ${actual.jugador}, ${actual.nombre}, ${actual.rarezaNombre}` : ''}
      </p>

      {fase === 'final' && <FinalCarta carta={ultima} onContinuar={() => irA('resumen')} />}
    </main>
  )
}
