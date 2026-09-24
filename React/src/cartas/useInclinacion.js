import { useEffect, useRef, useSyncExternalStore } from 'react'

const SUAVIZADO = 0.16
const GRADOS = 16
// Grados de giro del telefono que llevan el brillo de un borde al otro
const RECORRIDO_GIROSCOPIO = 40

function limitar(valor) {
  return Math.min(1, Math.max(0, valor))
}

function estadoInicial() {
  if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) {
    return 'no-disponible'
  }
  if (!window.isSecureContext) {
    return 'requiere-https'
  }
  // iPhone pide permiso con un toque; Android lo da solo si hay sensor
  return typeof window.DeviceOrientationEvent.requestPermission === 'function' ? 'requiere-permiso' : 'escuchando'
}

// El permiso es de la pagina, no de cada carta: al darlo una vez, todas las
// cartas montadas empiezan a escuchar
let estadoGiroscopio = null
const oyentes = new Set()

function leerGiroscopio() {
  if (estadoGiroscopio === null) {
    estadoGiroscopio = estadoInicial()
  }
  return estadoGiroscopio
}

function cambiarGiroscopio(nuevo) {
  if (estadoGiroscopio !== nuevo) {
    estadoGiroscopio = nuevo
    oyentes.forEach((avisar) => avisar())
  }
}

function suscribir(avisar) {
  oyentes.add(avisar)
  return () => oyentes.delete(avisar)
}

export function useGiroscopio() {
  return useSyncExternalStore(suscribir, leerGiroscopio, () => 'no-disponible')
}

// Tiene que llamarse desde un toque: iOS rechaza el permiso fuera de un gesto
export async function pedirGiroscopio() {
  const pedir = window.DeviceOrientationEvent?.requestPermission
  if (typeof pedir !== 'function') {
    return
  }
  try {
    cambiarGiroscopio(await pedir() === 'granted' ? 'escuchando' : 'denegado')
  } catch {
    cambiarGiroscopio('denegado')
  }
}

// Mueve el brillo con el dedo, el mouse o el giroscopio. Escribe variables CSS
// directo en el nodo: con setState seria un render por cada evento del sensor.
export function useInclinacion({ activa = true } = {}) {
  const ref = useRef(null)
  const valores = useRef({ x: 0.5, y: 0.5, fuerza: 0 })
  const giroscopio = useGiroscopio()

  // Todo vive en un solo efecto: el ciclo se llama a si mismo, y dentro de un
  // useCallback eso lo rechaza el linter de React
  useEffect(() => {
    const nodo = ref.current
    if (!nodo || !activa) {
      return undefined
    }
    let objetivo = { x: 0.5, y: 0.5, fuerza: 0 }
    let tocando = false
    let base = null
    let cuadro = 0

    const pintar = () => {
      const a = valores.current
      a.x += (objetivo.x - a.x) * SUAVIZADO
      a.y += (objetivo.y - a.y) * SUAVIZADO
      a.fuerza += (objetivo.fuerza - a.fuerza) * SUAVIZADO
      nodo.style.setProperty('--px', a.x.toFixed(4))
      nodo.style.setProperty('--py', a.y.toFixed(4))
      nodo.style.setProperty('--rx', ((a.x - 0.5) * 2 * GRADOS).toFixed(2))
      nodo.style.setProperty('--ry', ((0.5 - a.y) * 2 * GRADOS).toFixed(2))
      nodo.style.setProperty('--fuerza', a.fuerza.toFixed(3))
      const quieto = Math.abs(objetivo.x - a.x) + Math.abs(objetivo.y - a.y) + Math.abs(objetivo.fuerza - a.fuerza) < 0.002
      // En reposo el ciclo se duerme; el siguiente evento lo despierta
      cuadro = quieto ? 0 : requestAnimationFrame(pintar)
    }
    const despertar = () => {
      if (!cuadro) {
        cuadro = requestAnimationFrame(pintar)
      }
    }

    const mover = (evento) => {
      const caja = nodo.getBoundingClientRect()
      tocando = true
      objetivo = {
        x: limitar((evento.clientX - caja.left) / caja.width),
        y: limitar((evento.clientY - caja.top) / caja.height),
        fuerza: 1,
      }
      despertar()
    }
    const soltar = () => {
      tocando = false
      objetivo = { x: 0.5, y: 0.5, fuerza: 0 }
      despertar()
    }
    // Si un contenedor captura el puntero para arrastrar, el pointerup ya no
    // llega aqui: por eso tambien se escucha en la ventana
    const soltarAfuera = () => {
      if (tocando) {
        soltar()
      }
    }

    const leerGiroscopio = (evento) => {
      // Las computadoras mandan un evento con todo en null: no hay sensor
      if (evento.beta == null || evento.gamma == null || tocando) {
        return
      }
      if (!base) {
        base = { beta: evento.beta, gamma: evento.gamma }
        cambiarGiroscopio('activo')
      }
      // La base sigue despacio al telefono: si lo dejas en otro angulo, se recentra
      base.beta += (evento.beta - base.beta) * 0.01
      base.gamma += (evento.gamma - base.gamma) * 0.01
      let dx = evento.gamma - base.gamma
      let dy = evento.beta - base.beta
      const angulo = window.screen?.orientation?.angle ?? 0
      if (angulo === 90) {
        [dx, dy] = [dy, -dx]
      } else if (angulo === 270) {
        [dx, dy] = [-dy, dx]
      }
      objetivo = {
        x: limitar(0.5 + dx / RECORRIDO_GIROSCOPIO),
        y: limitar(0.5 + dy / RECORRIDO_GIROSCOPIO),
        fuerza: Math.min(1, 0.35 + (Math.abs(dx) + Math.abs(dy)) / 12),
      }
      despertar()
    }
    const conGiroscopio = giroscopio === 'escuchando' || giroscopio === 'activo'

    nodo.addEventListener('pointerdown', mover)
    nodo.addEventListener('pointermove', mover)
    nodo.addEventListener('pointerleave', soltar)
    nodo.addEventListener('pointerup', soltar)
    nodo.addEventListener('pointercancel', soltar)
    window.addEventListener('pointerup', soltarAfuera)
    window.addEventListener('pointercancel', soltarAfuera)
    if (conGiroscopio) {
      window.addEventListener('deviceorientation', leerGiroscopio)
    }
    return () => {
      nodo.removeEventListener('pointerdown', mover)
      nodo.removeEventListener('pointermove', mover)
      nodo.removeEventListener('pointerleave', soltar)
      nodo.removeEventListener('pointerup', soltar)
      nodo.removeEventListener('pointercancel', soltar)
      window.removeEventListener('pointerup', soltarAfuera)
      window.removeEventListener('pointercancel', soltarAfuera)
      window.removeEventListener('deviceorientation', leerGiroscopio)
      cancelAnimationFrame(cuadro)
    }
  }, [activa, giroscopio])

  return { ref, valores }
}
