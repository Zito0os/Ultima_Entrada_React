import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

import TeamBadge from './TeamBadge'
import { useJugador } from './almacen/useJugador'
import { configDe } from './configEscudos'
import { buscarEscudo } from './escudosData'
import { cargarSVG, crearEntorno, extruirDesdeSVG } from './extruirEscudo'

const DURACION_VUELTA = 1800

const suavizar = (t) => 1 - (1 - t) ** 3

// Escudo extruido del SVG que da una vuelta completa al entrar y al tocarlo
export default function EscudoGiratorio({ team }) {
  const contenedor = useRef(null)
  const girar = useRef(() => {})
  const [fallo, setFallo] = useState(false)
  const { perfil } = useJugador()
  const escudo = buscarEscudo(team.id)
  const config = useMemo(() => configDe(perfil.escudos, escudo.id, escudo.config), [perfil.escudos, escudo.id, escudo.config])

  useEffect(() => {
    const nodo = contenedor.current
    let vivo = true
    let renderer = null
    let entorno = null
    let modelo = null
    let cuadro = 0

    const arrancar = async () => {
      try {
        const datos = await cargarSVG(`${import.meta.env.BASE_URL}${escudo.svg}`)
        if (!vivo) {
          return
        }
        const lado = nodo.clientWidth || 120
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
        renderer.setSize(lado, lado)
        nodo.appendChild(renderer.domElement)

        const escena = new THREE.Scene()
        entorno = crearEntorno(renderer)
        escena.environment = entorno
        escena.add(new THREE.AmbientLight(0xffffff, 0.55))
        const clave = new THREE.DirectionalLight(0xffffff, 0.85)
        clave.position.set(120, 160, 220)
        escena.add(clave)
        const relleno = new THREE.DirectionalLight(0x9ec9ff, 0.35)
        relleno.position.set(-160, -60, 120)
        escena.add(relleno)

        const camara = new THREE.PerspectiveCamera(32, 1, 1, 2000)
        camara.position.set(0, 0, 215)

        const { objeto } = extruirDesdeSVG(datos, { ...config, color: escudo.color })
        modelo = objeto
        escena.add(objeto)

        const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        let inicio = 0

        // Solo dibuja mientras gira; quieto no gasta GPU
        const paso = (ahora) => {
          if (!vivo) {
            return
          }
          if (!inicio) {
            inicio = ahora
          }
          const t = Math.min(1, (ahora - inicio) / DURACION_VUELTA)
          objeto.rotation.y = suavizar(t) * Math.PI * 2
          renderer.render(escena, camara)
          cuadro = t < 1 ? requestAnimationFrame(paso) : 0
        }

        girar.current = () => {
          if (quieto || cuadro) {
            return
          }
          inicio = 0
          cuadro = requestAnimationFrame(paso)
        }

        renderer.render(escena, camara)
        girar.current()
      } catch {
        if (vivo) {
          setFallo(true)
        }
      }
    }

    arrancar()

    return () => {
      vivo = false
      cancelAnimationFrame(cuadro)
      girar.current = () => {}
      modelo?.traverse((parte) => {
        parte.geometry?.dispose()
        parte.material?.dispose?.()
      })
      entorno?.dispose()
      if (renderer) {
        renderer.dispose()
        renderer.domElement.remove()
      }
    }
  }, [escudo, config])

  if (fallo) {
    return <TeamBadge team={team} />
  }

  return (
    <button className="escudo-giratorio" type="button" ref={contenedor} onClick={() => girar.current()} aria-label={`Girar el escudo de ${team.name}`} />
  )
}
