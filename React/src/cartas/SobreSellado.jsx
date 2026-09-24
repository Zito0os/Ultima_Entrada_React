import { useRef } from 'react'

import SobreArte from './SobreArte'
import { useArrastre } from './useArrastre'
import { useInclinacion } from './useInclinacion'

// Cuanto hay que recorrer del ancho del sobre para cortarlo, y desde cuanto
// basta con soltar para que termine solo
const RECORRIDO = 0.78
const UMBRAL = 0.6

export default function SobreSellado({ sobre, abierto, onAbrir }) {
  const nodo = useRef(null)
  const avance = useRef(0)
  const { ref: escena } = useInclinacion({ activa: !abierto })

  const cortar = (valor) => {
    avance.current = valor
    nodo.current?.style.setProperty('--corte', valor.toFixed(3))
  }

  const abrir = () => {
    if (!abierto) {
      cortar(1)
      onAbrir()
    }
  }

  const arrastre = useArrastre({
    onMover: ({ dx }) => {
      if (abierto) {
        return
      }
      const ancho = nodo.current.getBoundingClientRect().width
      const valor = Math.max(0, Math.min(1, dx / (ancho * RECORRIDO)))
      cortar(valor)
      if (valor >= 1) {
        abrir()
      }
    },
    onSoltar: ({ cancelado }) => {
      if (!cancelado && avance.current >= UMBRAL) {
        abrir()
      } else if (!abierto) {
        cortar(0)
      }
    },
  })

  // El boton va fuera del area que captura el puntero: dentro, el click se pierde
  return (
    <div className={abierto ? 'sobre-zona es-abierto' : 'sobre-zona'}>
      <div className="sobre-escena" ref={escena}>
        <SobreArte sobre={sobre} innerRef={nodo} {...arrastre} />
      </div>
      {!abierto && (
        <>
          <p className="sobre__pista" aria-hidden="true">DESLIZA A LA DERECHA PARA ABRIR</p>
          <button className="sobre__abrir" type="button" onClick={abrir}>Abrir sin deslizar</button>
        </>
      )}
    </div>
  )
}
