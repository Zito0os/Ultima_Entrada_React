import { useEffect, useRef, useState } from 'react'

import { PROPORCION } from './diseno'
import { cargarTexturas, crearCartaHolo } from './holoShader'
import { useInclinacion } from './useInclinacion'
import './carta.css'

const CAMPO_VISION = 30
const INCLINACION_Y = 0.9
const INCLINACION_X = 0.7

// Carta en WebGL con el mismo sombreador que el AR. El giro sale del dedo o
// del giroscopio; "volteada" la gira para ver el dorso.
export default function VisorCarta({ carta, volteada = false, onError }) {
  const { ref, valores } = useInclinacion()
  const volteo = useRef(volteada ? Math.PI : 0)
  // En ref: si el padre pasa una funcion nueva en cada render, el efecto que
  // arma WebGL no debe reiniciarse por eso
  const avisar = useRef(onError)
  const [listo, setListo] = useState(false)

  useEffect(() => {
    volteo.current = volteada ? Math.PI : 0
  }, [volteada])

  useEffect(() => {
    avisar.current = onError
  }, [onError])

  useEffect(() => {
    const contenedor = ref.current
    let vivo = true
    let renderer = null
    let modelo = null
    let observador = null

    const arrancar = async () => {
      const THREE = await import('three')
      if (!vivo) {
        return
      }
      // Canvas propio por montaje: se puede soltar el contexto al salir sin
      // matar el del siguiente montaje, que en StrictMode llega enseguida
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.domElement.className = 'visor-carta__lienzo'
      contenedor.appendChild(renderer.domElement)

      const escena = new THREE.Scene()
      const camara = new THREE.PerspectiveCamera(CAMPO_VISION, 1, 0.1, 50)

      const ajustar = () => {
        const { width, height } = contenedor.getBoundingClientRect()
        if (!width || !height) {
          return
        }
        renderer.setSize(width, height, false)
        camara.aspect = width / height
        const mitad = Math.tan((CAMPO_VISION * Math.PI) / 360)
        const porAlto = (PROPORCION / 2) / mitad
        const porAncho = 0.5 / (mitad * camara.aspect)
        camara.position.z = Math.max(porAlto, porAncho) * 1.04
        camara.updateProjectionMatrix()
      }
      ajustar()
      observador = new ResizeObserver(ajustar)
      observador.observe(contenedor)

      const texturas = await cargarTexturas(THREE, renderer, carta)
      if (!vivo) {
        texturas.frente.dispose()
        texturas.dorso.dispose()
        texturas.mapa.dispose()
        return
      }
      modelo = crearCartaHolo(THREE, { ...texturas, rareza: carta.rareza })
      escena.add(modelo.malla)
      setListo(true)

      const reloj = new THREE.Clock()
      let giro = volteo.current
      renderer.setAnimationLoop(() => {
        const { x, y } = valores.current
        giro += (volteo.current - giro) * 0.12
        modelo.malla.rotation.y = giro + (x - 0.5) * INCLINACION_Y
        modelo.malla.rotation.x = (y - 0.5) * INCLINACION_X
        modelo.animar(reloj.getElapsedTime())
        renderer.render(escena, camara)
      })
    }

    arrancar().catch((fallo) => {
      if (vivo) {
        avisar.current?.(fallo)
      }
    })

    return () => {
      vivo = false
      observador?.disconnect()
      if (renderer) {
        renderer.setAnimationLoop(null)
        modelo?.liberar()
        renderer.dispose()
        renderer.forceContextLoss()
        renderer.domElement.remove()
      }
    }
  }, [carta, ref, valores])

  return (
    <div className={listo ? 'visor-carta es-listo' : 'visor-carta'} ref={ref} role="img" aria-label={`${carta.jugador}, carta ${carta.rarezaNombre.toLowerCase()} en 3D`} />
  )
}
