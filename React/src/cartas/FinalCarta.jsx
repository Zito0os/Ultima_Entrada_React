import { useEffect, useRef } from 'react'

import BotonGiroscopio from './BotonGiroscopio'
import CartaViva from './CartaViva'
import { lanzarConfeti } from './confeti'

const CONFETI = {
  especial: ['#F5C64B', '#FFE9A3', '#FFFFFF', '#227AE6'],
  holo: ['#FF6B8B', '#FFD93D', '#6BFF95', '#6BD5FF', '#B06BFF', '#FFFFFF'],
}

// Mas de esto entre bajar y soltar el dedo es que estaba inclinando la carta
const TOLERANCIA_TOQUE = 10

export default function FinalCarta({ carta, onContinuar }) {
  const lienzo = useRef(null)
  const boton = useRef(null)
  const inicio = useRef(null)

  useEffect(() => {
    boton.current?.focus({ preventScroll: true })
    return lanzarConfeti(lienzo.current, { colores: [...CONFETI[carta.rareza], ...carta.colores] })
  }, [carta])

  const tocar = (evento) => {
    const punto = inicio.current
    if (punto && Math.hypot(evento.clientX - punto.x, evento.clientY - punto.y) > TOLERANCIA_TOQUE) {
      return
    }
    onContinuar()
  }

  return (
    <div
      className={`final final--${carta.rareza}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="final-titulo"
      onPointerDown={(evento) => { inicio.current = { x: evento.clientX, y: evento.clientY } }}
      onClick={tocar}
    >
      <canvas className="final__confeti" ref={lienzo} aria-hidden="true" />
      <p className="final__titulo" id="final-titulo">¡{carta.rarezaNombre}!</p>
      <div className="final__carta">
        <CartaViva carta={carta} webgl />
        {carta.nueva && <span className="final__nueva">NUEVA</span>}
      </div>
      <div onClick={(evento) => evento.stopPropagation()}>
        <BotonGiroscopio />
      </div>
      <button className="final__continuar" type="button" ref={boton} onClick={(evento) => { evento.stopPropagation(); onContinuar() }}>
        TOCA PARA CONTINUAR
      </button>
    </div>
  )
}
