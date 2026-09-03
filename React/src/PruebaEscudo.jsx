import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import PageHeader from './PageHeader'
import { CONFIG_BASE, borrarConfig, guardarConfig, leerConfig, marcarOnboardingVisto, onboardingVisto, tieneConfig } from './configEscudos'
import { crearEfectos } from './efectosAR'
import { escudos } from './escudosData'
import { cargarSVG, crearExplosion, extruirDesdeSVG } from './extruirEscudo'

const controles = [
  { id: 'profundidad', nombre: 'PROFUNDIDAD', min: 1, max: 40 },
  { id: 'bisel', nombre: 'BISEL', min: 0, max: 6, paso: 0.5 },
  { id: 'segmentos', nombre: 'SEGMENTOS DE CURVA', min: 2, max: 24 },
  { id: 'separacion', nombre: 'SEPARACIÓN DE CAPAS', min: 0, max: 30 },
  { id: 'metalico', nombre: 'ACABADO METÁLICO', min: 0, max: 100, unidad: '%' },
  { id: 'aspereza', nombre: 'ASPEREZA', min: 0, max: 100, unidad: '%' },
  { id: 'escala', nombre: 'TAMAÑO EN AR', min: 40, max: 200, unidad: '%' },
  { id: 'velocidad', nombre: 'VELOCIDAD DE GIRO', min: 0, max: 60 },
  { id: 'estabilidad', nombre: 'ESTABILIDAD EN AR', min: 0, max: 100, unidad: '%' },
]

export default function PruebaEscudo() {
  const contenedor = useRef(null)
  const escena = useRef(null)
  const [escudoId, setEscudoId] = useState(escudos[0].id)
  const [config, setConfig] = useState(() => leerConfig(escudos[0].id))
  const [girando, setGirando] = useState(true)
  const [efectos, setEfectos] = useState(false)
  const [medidas, setMedidas] = useState({ triangulos: 0, trazos: 0 })
  const [guardado, setGuardado] = useState(() => tieneConfig(escudos[0].id))
  const [aviso, setAviso] = useState('')
  const [onboarding, setOnboarding] = useState(() => !onboardingVisto())

  const escudo = escudos.find((item) => item.id === escudoId) || escudos[0]

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

    const orbita = new OrbitControls(camara, renderer.domElement)
    orbita.enableDamping = true

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
      if (escena.current?.girando !== false) {
        grupo.rotation.y += (escena.current?.velocidad ?? 20) / 1000
      }
      escena.current?.efecto.animar()
      escena.current?.explosion?.animar()
      orbita.update()
      renderer.render(scene, camara)
      requestAnimationFrame(animar)
    }
    animar()

    const efecto = crearEfectos(THREE, 60)
    scene.add(efecto.grupo)

    escena.current = { grupo, orbita, efecto, girando: true, velocidad: CONFIG_BASE.velocidad }

    return () => {
      vivo = false
      observador.disconnect()
      orbita.dispose()
      renderer.dispose()
      nodo.removeChild(renderer.domElement)
    }
  }, [])

  useEffect(() => {
    if (!escena.current) {
      return
    }
    const { grupo } = escena.current
    let cancelado = false

    cargarSVG(`${import.meta.env.BASE_URL}${escudo.svg}`).then((datos) => {
      if (cancelado) {
        return
      }
      const { objeto, capas, triangulos, trazos } = extruirDesdeSVG(datos, { ...config, color: escudo.color })
      grupo.clear()
      grupo.add(objeto)
      escena.current.explosion = crearExplosion(capas, config.separacion)
      setMedidas({ triangulos, trazos })
    })

    return () => {
      cancelado = true
    }
  }, [escudo, config])

  useEffect(() => {
    if (escena.current) {
      escena.current.girando = girando
      escena.current.velocidad = config.velocidad
    }
  }, [girando, config.velocidad])

  useEffect(() => {
    if (escena.current) {
      escena.current.efecto.grupo.visible = efectos
    }
  }, [efectos])

  const cambiarEscudo = (id) => {
    setEscudoId(id)
    setConfig(leerConfig(id))
    setGuardado(tieneConfig(id))
    setAviso('')
  }

  const cambiar = (id, valor) => setConfig((actual) => ({ ...actual, [id]: Number(valor) }))

  const guardar = () => {
    const ok = guardarConfig(escudoId, config)
    setGuardado(ok)
    setAviso(ok ? 'Guardado. Así se va a ver en AR.' : 'No se pudo guardar en este navegador.')
    setTimeout(() => setAviso(''), 3200)
  }

  const restaurar = () => {
    borrarConfig(escudoId)
    setConfig({ ...CONFIG_BASE })
    setGuardado(false)
    setAviso('Volvió a los valores de fábrica.')
    setTimeout(() => setAviso(''), 3200)
  }

  const cerrarOnboarding = () => {
    marcarOnboardingVisto()
    setOnboarding(false)
  }

  const dentro = medidas.triangulos <= 2000

  return (
    <main className="prueba-shell">
      <PageHeader title="MODELOS" backTo="/ar" rightLabel={guardado ? 'GUARDADO' : 'DE FÁBRICA'} />

      <section className="prueba-content" aria-label="Personalizar el escudo 3D">
        <div className="prueba-escudos" role="tablist" aria-label="Elegir escudo">
          {escudos.map((item) => (
            <button className={escudoId === item.id ? 'prueba-chip is-active' : 'prueba-chip'} type="button" role="tab" aria-selected={escudoId === item.id} onClick={() => cambiarEscudo(item.id)} key={item.id}>
              {item.nombre}
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
          {controles.map((control) => (
            <label key={control.id}>
              <span>{control.nombre}<b>{config[control.id]}{control.unidad || ''}</b></span>
              <input type="range" min={control.min} max={control.max} step={control.paso || 1} value={config[control.id]} onChange={(e) => cambiar(control.id, e.target.value)} />
            </label>
          ))}
        </div>

        {aviso && <p className="prueba-aviso" role="status">{aviso}</p>}

        <div className="prueba-acciones">
          <button className="prueba-boton" type="button" onClick={guardar}>GUARDAR</button>
          <button className="prueba-boton is-secundario" type="button" onClick={restaurar}>RESTAURAR</button>
        </div>
        <div className="prueba-acciones">
          <button className="prueba-boton is-fantasma" type="button" onClick={() => setGirando((g) => !g)} aria-pressed={girando}>
            {girando ? 'DETENER GIRO' : 'GIRAR'}
          </button>
          <button className={efectos ? 'prueba-boton is-secundario' : 'prueba-boton is-fantasma'} type="button" onClick={() => setEfectos((e) => !e)} aria-pressed={efectos}>
            EFECTOS
          </button>
          <button className="prueba-boton is-fantasma" type="button" onClick={() => escena.current?.explosion?.disparar()}>
            CAPAS
          </button>
        </div>
        <p className="prueba-nota">Arrastra para orbitar y rueda para acercar.</p>
      </section>

      {onboarding && (
        <div className="modal-backdrop" role="presentation" onClick={cerrarOnboarding}>
          <section className="challenge-modal onboarding-modal" role="dialog" aria-modal="true" aria-labelledby="onboarding-titulo" onClick={(event) => event.stopPropagation()}>
            <span className="modal-kicker">MODELOS 3D</span>
            <h2 id="onboarding-titulo">ARMA TU<br />ESCUDO</h2>
            <ol className="rules-list">
              <li>Elige un escudo y muévele a los controles para cambiar su grosor, acabado y color.</li>
              <li>El contador te dice cuántos triángulos lleva, para que no se ponga pesado.</li>
              <li>Al guardar, ese mismo escudo es el que aparece cuando lo escaneas con la cámara.</li>
            </ol>
            <button className="button button-primary modal-action" type="button" onClick={cerrarOnboarding}>ENTENDIDO</button>
          </section>
        </div>
      )}
    </main>
  )
}
