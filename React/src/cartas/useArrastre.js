import { useRef } from 'react'

// Si el dedo se quedo quieto mas que esto antes de soltar, no hubo lanzamiento
const PAUSA_SIN_IMPULSO = 90

// Arrastre con un dedo o el mouse. La velocidad se mide mientras se mueve: al
// soltar, el pointerup suele llegar en el mismo punto que el ultimo movimiento.
export function useArrastre({ onMover, onSoltar }) {
  const gesto = useRef(null)

  const terminar = (evento, cancelado) => {
    const g = gesto.current
    if (!g || evento.pointerId !== g.id) {
      return
    }
    gesto.current = null
    const conImpulso = !cancelado && performance.now() - g.tiempo < PAUSA_SIN_IMPULSO
    onSoltar?.({
      dx: cancelado ? 0 : evento.clientX - g.x,
      dy: cancelado ? 0 : evento.clientY - g.y,
      vx: conImpulso ? g.vx : 0,
      vy: conImpulso ? g.vy : 0,
      cancelado,
    })
  }

  return {
    onPointerDown(evento) {
      if (evento.button > 0) {
        return
      }
      gesto.current = {
        id: evento.pointerId,
        x: evento.clientX,
        y: evento.clientY,
        ultimoX: evento.clientX,
        ultimoY: evento.clientY,
        tiempo: performance.now(),
        vx: 0,
        vy: 0,
      }
      // Lanza si el puntero ya se solto (un toque rapidisimo): sin captura el
      // arrastre sigue funcionando mientras el dedo no salga del elemento
      try {
        evento.currentTarget.setPointerCapture(evento.pointerId)
      } catch {
        // sin captura
      }
    },
    onPointerMove(evento) {
      const g = gesto.current
      if (!g || evento.pointerId !== g.id) {
        return
      }
      const ahora = performance.now()
      const dt = Math.max(1, ahora - g.tiempo)
      // Promedio con el anterior para que un evento suelto no dispare la velocidad
      g.vx = g.vx * 0.4 + ((evento.clientX - g.ultimoX) / dt) * 0.6
      g.vy = g.vy * 0.4 + ((evento.clientY - g.ultimoY) / dt) * 0.6
      g.ultimoX = evento.clientX
      g.ultimoY = evento.clientY
      g.tiempo = ahora
      onMover?.({ dx: evento.clientX - g.x, dy: evento.clientY - g.y })
    },
    onPointerUp: (evento) => terminar(evento, false),
    onPointerCancel: (evento) => terminar(evento, true),
  }
}
