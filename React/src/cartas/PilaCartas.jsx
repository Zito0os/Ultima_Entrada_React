import { useEffect, useRef, useState } from 'react'

import CartaVolteable from './CartaVolteable'
import { prefiereMenosMovimiento } from './movimiento'
import { useArrastre } from './useArrastre'

// Fraccion del ancho de la pila o velocidad (px por ms) que cuentan como lanzar
const DISTANCIA_LANZAR = 0.32
const VELOCIDAD_LANZAR = 0.55
const DURACION_VUELO = 300
// Lo que tarda el volteo en apertura.css: hasta entonces el boton estorba
const DURACION_VOLTEO = 450

// Opcion A, como TCG Pocket: la de arriba boca arriba, las demas debajo boca
// abajo. Al arrastrar la de arriba, las de abajo se abren en abanico.
export default function PilaCartas({ cartas, vistas, bloqueada, onSiguiente }) {
  const pila = useRef(null)
  const tope = useRef(null)
  const volando = useRef(false)
  const indiceTope = Math.max(0, vistas - 1)
  // La ultima carta que ya termino de voltearse: hasta entonces el boton se esconde
  const [revelada, setRevelada] = useState(0)
  const volteando = revelada !== vistas

  useEffect(() => {
    const temporizador = setTimeout(() => setRevelada(vistas), prefiereMenosMovimiento() ? 0 : DURACION_VOLTEO)
    return () => clearTimeout(temporizador)
  }, [vistas])

  const abanico = (valor) => pila.current?.style.setProperty('--abanico', valor.toFixed(3))

  const regresar = () => {
    const nodo = tope.current
    if (!nodo) {
      return
    }
    nodo.style.transition = 'transform .35s var(--curva)'
    nodo.style.transform = ''
    abanico(0)
  }

  const lanzar = (direccion) => {
    const nodo = tope.current
    if (!nodo || volando.current) {
      return
    }
    volando.current = true
    nodo.style.transition = `transform ${DURACION_VUELO}ms ease-in`
    nodo.style.transform = `translate(${direccion * 130}vw, -8vh) rotate(${direccion * 28}deg)`
    abanico(0)
    // Con un temporizador y no con transitionend: si el sistema pide menos
    // movimiento no hay transicion y el evento nunca llega
    setTimeout(() => {
      volando.current = false
      onSiguiente()
    }, prefiereMenosMovimiento() ? 0 : DURACION_VUELO)
  }

  const arrastre = useArrastre({
    onMover: ({ dx, dy }) => {
      if (bloqueada || volando.current || !tope.current) {
        return
      }
      tope.current.style.transition = 'none'
      tope.current.style.transform = `translate(${dx}px, ${dy * 0.25}px) rotate(${dx * 0.05}deg)`
      abanico(Math.min(1, Math.abs(dx) / 140))
    },
    onSoltar: ({ dx, vx, cancelado }) => {
      if (bloqueada || volando.current) {
        return
      }
      const ancho = pila.current.getBoundingClientRect().width
      if (!cancelado && (Math.abs(dx) > ancho * DISTANCIA_LANZAR || Math.abs(vx) > VELOCIDAD_LANZAR)) {
        lanzar(Math.sign(dx || vx) || 1)
      } else {
        regresar()
      }
    },
  })

  return (
    <>
      <div className="pila" ref={pila}>
        {cartas.map((carta, indice) => {
          if (indice < indiceTope) {
            return null
          }
          const profundidad = indice - indiceTope
          const esTope = profundidad === 0
          // La llave es la posicion: en un sobre puede venir dos veces la misma carta
          return (
            <div
              className={esTope ? 'pila__carta es-tope' : 'pila__carta'}
              style={{ '--n': profundidad, zIndex: cartas.length - profundidad }}
              key={indice}
              ref={esTope ? tope : null}
              {...(esTope ? arrastre : {})}
            >
              <CartaVolteable carta={carta} revelada={indice < vistas} />
            </div>
          )
        })}
      </div>
      <button className="apertura__siguiente" type="button" disabled={bloqueada || volteando} onClick={() => lanzar(1)}>
        SIGUIENTE
      </button>
    </>
  )
}
