import { useState } from 'react'

import { rutaCarta } from './cartasData'
import { mascaraFoil } from './diseno'
import { useInclinacion } from './useInclinacion'
import './carta.css'

// Una sola textura de destellos para todas las cartas, creada al importar
function prepararChispas() {
  if (typeof document === 'undefined') {
    return
  }
  const lienzo = document.createElement('canvas')
  lienzo.width = 160
  lienzo.height = 160
  const ctx = lienzo.getContext('2d')
  for (let n = 0; n < 110; n += 1) {
    const x = Math.random() * 160
    const y = Math.random() * 160
    const radio = 0.5 + Math.random() * 1.6
    const brillo = ctx.createRadialGradient(x, y, 0, x, y, radio * 3)
    brillo.addColorStop(0, 'rgba(255, 255, 255, 1)')
    brillo.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = brillo
    ctx.fillRect(x - radio * 3, y - radio * 3, radio * 6, radio * 6)
  }
  document.documentElement.style.setProperty('--chispas', `url(${lienzo.toDataURL()})`)
}

prepararChispas()

export default function Carta({ carta, interactiva = false, className = '', style, ...resto }) {
  const { ref } = useInclinacion({ activa: interactiva })
  const [sinImagen, setSinImagen] = useState(false)

  const clases = ['carta', `carta--${carta.rareza}`, interactiva ? 'es-interactiva' : '', className].filter(Boolean).join(' ')

  return (
    <div
      ref={ref}
      className={clases}
      style={{ '--mascara-oro': mascaraFoil(carta.id, 'oro'), '--mascara-arco': mascaraFoil(carta.id, 'arco'), ...style }}
      {...resto}
    >
      <div className="carta__giro">
        {sinImagen ? (
          <div className="carta__respaldo">
            <strong>{carta.jugador}</strong>
            <span>{carta.nombre}</span>
            <small>{carta.rarezaNombre}</small>
          </div>
        ) : (
          <img
            className="carta__cara"
            src={rutaCarta(carta.id)}
            alt={`${carta.jugador}, ${carta.nombre}, carta ${carta.rarezaNombre.toLowerCase()}`}
            draggable="false"
            loading="lazy"
            onError={() => setSinImagen(true)}
          />
        )}
        <div className="carta__foil" aria-hidden="true" />
        <div className="carta__oro" aria-hidden="true" />
        {carta.rareza === 'holo' && <div className="carta__chispas" aria-hidden="true" />}
        <div className="carta__brillo" aria-hidden="true" />
      </div>
    </div>
  )
}
