import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import PageHeader from './PageHeader'
import { escudos } from './escudosData'
import { cargarSVG, extruirDesdeSVG } from './extruirEscudo'

export default function PruebaEscudo() {
  const contenedor = useRef(null)
  const escena = useRef(null)
  const [escudoId, setEscudoId] = useState('mlb')
  const [profundidad, setProfundidad] = useState(16)
  const [bisel, setBisel] = useState(1.5)
  const [segmentos, setSegmentos] = useState(4)
  const [separacion, setSeparacion] = useState(6)
  const [girando, setGirando] = useState(true)
  const [medidas, setMedidas] = useState({ triangulos: 0, trazos: 0 })

  useEffect(() => {
    const nodo = contenedor.current
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    nodo.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camara = new THREE.PerspectiveCamera(45, 1, 1, 2000)
    camara.position.set(90, 60, 175)

    scene.add(new THREE.AmbientLight(0xffffff, 1.4))
    const clave = new THREE.DirectionalLight(0xffffff, 2.4)
    clave.position.set(120, 160, 220)
    scene.add(clave)
    const relleno = new THREE.DirectionalLight(0x9ec9ff, 1.2)
    relleno.position.set(-160, -60, 120)
    scene.add(relleno)
    const borde = new THREE.DirectionalLight(0xffffff, 1.5)
    borde.position.set(0, 40, -220)
    scene.add(borde)

    const controles = new OrbitControls(camara, renderer.domElement)
    controles.enableDamping = true
    controles.autoRotateSpeed = 4.5

    const grupo = new THREE.Group()
    scene.add(grupo)

    const redimensionar = () => {
      const ancho = nodo.clientWidth
      const alto = Math.round(ancho * 0.9)
      renderer.setSize(ancho, alto)
      camara.aspect = ancho / alto
      camara.updateProjectionMatrix()
    }
    redimensionar()
    const observador = new ResizeObserver(redimensionar)
    observador.observe(nodo)

    let vivo = true
    const animar = () => {
      if (!vivo) {
        return
      }
      controles.update()
      renderer.render(scene, camara)
      requestAnimationFrame(animar)
    }
    animar()

    escena.current = { grupo, controles }

    return () => {
      vivo = false
      observador.disconnect()
      controles.dispose()
      renderer.dispose()
      nodo.removeChild(renderer.domElement)
    }
  }, [])

  useEffect(() => {
    if (!escena.current) {
      return
    }
    const { grupo } = escena.current
    const escudo = escudos.find((item) => item.id === escudoId)
    let cancelado = false

    cargarSVG(`${import.meta.env.BASE_URL}${escudo.svg}`).then((datos) => {
      if (cancelado) {
        return
      }
      const { objeto, triangulos, trazos } = extruirDesdeSVG(datos, { profundidad, bisel, segmentos, separacion, color: escudo.color })
      grupo.clear()
      grupo.add(objeto)
      setMedidas({ triangulos, trazos })
    })

    return () => {
      cancelado = true
    }
  }, [escudoId, profundidad, bisel, segmentos, separacion])

  useEffect(() => {
    if (escena.current) {
      escena.current.controles.autoRotate = girando
    }
  }, [girando])

  const dentro = medidas.triangulos <= 2000

  return (
    <main className="prueba-shell">
      <PageHeader title="PRUEBA 3D" backTo="/ar" rightLabel="ESCUDOS" />

      <section className="prueba-content" aria-label="Prueba de extrusión de escudos">
        <div className="prueba-escudos" role="tablist" aria-label="Elegir escudo">
          {escudos.map((escudo) => (
            <button className={escudoId === escudo.id ? 'prueba-chip is-active' : 'prueba-chip'} type="button" role="tab" aria-selected={escudoId === escudo.id} onClick={() => setEscudoId(escudo.id)} key={escudo.id}>
              {escudo.nombre}
            </button>
          ))}
        </div>

        <div className="prueba-lienzo" ref={contenedor} />

        <div className="prueba-datos">
          <div><strong>{medidas.triangulos.toLocaleString('es-MX')}</strong><span>TRIÁNGULOS</span></div>
          <div><strong>{medidas.trazos}</strong><span>TRAZOS</span></div>
          <div className={dentro ? 'prueba-veredicto is-ok' : 'prueba-veredicto is-alto'}>
            <strong>{dentro ? 'OK' : 'ALTO'}</strong><span>TOPE 2000</span>
          </div>
        </div>

        <div className="prueba-controles">
          <label>
            <span>PROFUNDIDAD<b>{profundidad}</b></span>
            <input type="range" min="1" max="40" value={profundidad} onChange={(e) => setProfundidad(Number(e.target.value))} />
          </label>
          <label>
            <span>BISEL<b>{bisel}</b></span>
            <input type="range" min="0" max="6" step="0.5" value={bisel} onChange={(e) => setBisel(Number(e.target.value))} />
          </label>
          <label>
            <span>SEGMENTOS DE CURVA<b>{segmentos}</b></span>
            <input type="range" min="2" max="24" value={segmentos} onChange={(e) => setSegmentos(Number(e.target.value))} />
          </label>
          <label>
            <span>SEPARACIÓN DE CAPAS<b>{separacion}</b></span>
            <input type="range" min="0" max="30" value={separacion} onChange={(e) => setSeparacion(Number(e.target.value))} />
          </label>
        </div>

        <button className="prueba-boton" type="button" onClick={() => setGirando((g) => !g)} aria-pressed={girando}>
          {girando ? 'DETENER GIRO' : 'GIRAR'}
        </button>
        <p className="prueba-nota">Arrastra para orbitar y rueda para acercar.</p>
      </section>
    </main>
  )
}
