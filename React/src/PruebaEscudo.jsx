import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import PageHeader from './PageHeader'
import { CONFIG_BASE, CONTROLES_CAPA, SECCIONES, capaDe, configDe, moverCapa, ordenDe } from './configEscudos'
import { useJugador } from './almacen/useJugador'
import { crearEfectos } from './efectosAR'
import { escudos, rutaEscudo } from './escudosData'
import { cargarSVG, crearEntorno, crearExplosion, extruirDesdeSVG } from './extruirEscudo'

// Lo que aguanta un celular de gama media sin que baje la fluidez
const TOPE_TRIANGULOS = 20000

export default function PruebaEscudo() {
  const contenedor = useRef(null)
  const escena = useRef(null)
  const { perfil, acciones } = useJugador()
  const [escudoId, setEscudoId] = useState(escudos[0].id)
  const [config, setConfig] = useState(() => configDe(perfil.escudos, escudos[0].id, escudos[0].config))
  const [girando, setGirando] = useState(true)
  const [efectos, setEfectos] = useState(false)
  const [medidas, setMedidas] = useState({ triangulos: 0, trazos: 0 })
  const [capasInfo, setCapasInfo] = useState([])
  const [capaActiva, setCapaActiva] = useState(0)
  const [seccion, setSeccion] = useState('capas')
  const [aviso, setAviso] = useState('')
  const [onboarding, setOnboarding] = useState(() => !perfil.preferencias.onboardingModelos)

  const guardado = Boolean(perfil.escudos[escudoId])
  const escudo = escudos.find((item) => item.id === escudoId) || escudos[0]
  const orden = ordenDe(config, capasInfo.length)
  const capa = capaDe(config, capaActiva)

  useEffect(() => {
    const nodo = contenedor.current
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    // MindAR usa sRGB en su propio lienzo: el visor tiene que igualarlo o los
    // modelos se ven de otro color aqui que en la camara
    renderer.outputEncoding = THREE.sRGBEncoding
    nodo.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    // Sin esto el control de ACABADO METALICO solo apaga el color, porque un
    // material metalico se ve por lo que refleja y no habia nada que reflejar
    const entorno = crearEntorno(renderer)
    scene.environment = entorno

    const camara = new THREE.PerspectiveCamera(45, 1, 1, 2000)
    camara.position.set(90, 60, 175)

    scene.add(new THREE.AmbientLight(0xffffff, 0.55))
    const clave = new THREE.DirectionalLight(0xffffff, 0.85)
    clave.position.set(120, 160, 220)
    scene.add(clave)
    const relleno = new THREE.DirectionalLight(0x9ec9ff, 0.35)
    relleno.position.set(-160, -60, 120)
    scene.add(relleno)
    const borde = new THREE.DirectionalLight(0xffffff, 0.45)
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
      entorno.dispose()
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
      const { objeto, capas, triangulos, trazos, info } = extruirDesdeSVG(datos, { ...config, color: escudo.color })
      grupo.clear()
      grupo.add(objeto)
      escena.current.explosion = crearExplosion(capas)
      setMedidas({ triangulos, trazos })
      setCapasInfo(info)
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
    const elegido = escudos.find((item) => item.id === id)
    setEscudoId(id)
    setConfig(configDe(perfil.escudos, id, elegido?.config))
    setCapaActiva(0)
    setAviso('')
  }

  const cambiar = (id, valor) => setConfig((actual) => ({ ...actual, [id]: Number(valor) }))

  const alternar = (id) => setConfig((actual) => ({ ...actual, [id]: actual[id] ? 0 : 1 }))

  const cambiarCapa = (campo, valor) => setConfig((actual) => ({
    ...actual,
    capas: {
      ...actual.capas,
      [capaActiva]: { ...capaDe(actual, capaActiva), [campo]: valor },
    },
  }))

  const mover = (direccion) => setConfig((actual) => ({
    ...actual,
    orden: moverCapa(ordenDe(actual, capasInfo.length), capaActiva, direccion),
  }))

  const guardar = () => {
    acciones.guardarEscudo(escudoId, config)
    setAviso('Guardado. Así se va a ver en AR.')
    setTimeout(() => setAviso(''), 3200)
  }

  const restaurar = () => {
    acciones.borrarEscudo(escudoId)
    setConfig({ ...CONFIG_BASE, ...(escudo.config || {}) })
    setCapaActiva(0)
    setAviso('Volvió a los valores de fábrica.')
    setTimeout(() => setAviso(''), 3200)
  }

  const cerrarOnboarding = () => {
    acciones.marcarPreferencia('onboardingModelos', true)
    setOnboarding(false)
  }

  const dentro = medidas.triangulos <= TOPE_TRIANGULOS
  const posicion = orden.indexOf(capaActiva)
  const info = capasInfo[capaActiva]

  return (
    <main className="prueba-shell">
      <PageHeader title="MODELOS" backTo="/ar" rightLabel={guardado ? 'GUARDADO' : 'DE FÁBRICA'} />

      <section className="prueba-content" aria-label="Personalizar el escudo 3D">
        <div className="prueba-escudos" role="tablist" aria-label="Elegir escudo">
          {escudos.map((item) => (
            <button className={escudoId === item.id ? 'prueba-carta is-active' : 'prueba-carta'} type="button" role="tab" aria-selected={escudoId === item.id} onClick={() => cambiarEscudo(item.id)} key={item.id}>
              <img src={rutaEscudo(item.id)} alt="" aria-hidden="true" loading="lazy" />
              <span>{item.nombre}</span>
            </button>
          ))}
        </div>

        <div className="prueba-lienzo" ref={contenedor} />

        <div className="prueba-datos">
          <div><strong>{medidas.triangulos.toLocaleString('es-MX')}</strong><span>TRIÁNGULOS</span></div>
          <div><strong>{medidas.trazos}</strong><span>TRAZOS</span></div>
          <div className={dentro ? 'prueba-veredicto is-ok' : 'prueba-veredicto is-alto'}>
            <strong>{dentro ? 'OK' : 'ALTO'}</strong><span>TOPE {TOPE_TRIANGULOS / 1000}K</span>
          </div>
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

        <div className="prueba-secciones" role="tablist" aria-label="Grupos de ajustes">
          {[{ id: 'capas', nombre: 'CAPAS' }, ...SECCIONES].map((item) => (
            <button className={seccion === item.id ? 'prueba-seccion is-active' : 'prueba-seccion'} type="button" role="tab" aria-selected={seccion === item.id} onClick={() => setSeccion(item.id)} key={item.id}>
              {item.nombre}
            </button>
          ))}
        </div>

        {seccion === 'capas' && (
          <div className="capas-panel">
            {capasInfo.length < 2 ? (
              <p className="capas-vacio">Este escudo es de una sola capa, así que no hay nada que reordenar.</p>
            ) : (
              <>
                <p className="capas-ayuda">La de arriba es la que va al frente. Toca una para editarla.</p>
                <div className="capas-pila" role="tablist" aria-label="Capas del escudo">
                  {[...orden].reverse().map((indice) => {
                    const datos = capasInfo[indice]
                    const ajuste = capaDe(config, indice)
                    return (
                      <button
                        className={capaActiva === indice ? 'capa-chip is-active' : 'capa-chip'}
                        type="button"
                        role="tab"
                        aria-selected={capaActiva === indice}
                        onClick={() => setCapaActiva(indice)}
                        key={indice}
                      >
                        <span className="capa-muestra" style={{ background: ajuste.color || datos.color }} aria-hidden="true" />
                        <span className="capa-nombre">{ajuste.color || datos.color}</span>
                        <small>{datos.trazos} {datos.trazos === 1 ? 'trazo' : 'trazos'}</small>
                        {!ajuste.visible && <b className="capa-apagada">OCULTA</b>}
                      </button>
                    )
                  })}
                </div>

                <div className="capa-orden">
                  <button className="prueba-boton is-fantasma" type="button" onClick={() => mover(1)} disabled={posicion >= orden.length - 1}>
                    TRAER AL FRENTE
                  </button>
                  <button className="prueba-boton is-fantasma" type="button" onClick={() => mover(-1)} disabled={posicion <= 0}>
                    MANDAR ATRÁS
                  </button>
                </div>

                <div className="capa-ajustes">
                  <button
                    className={capa.visible ? 'prueba-boton is-secundario' : 'prueba-boton is-fantasma'}
                    type="button"
                    onClick={() => cambiarCapa('visible', !capa.visible)}
                    aria-pressed={capa.visible}
                  >
                    {capa.visible ? 'CAPA VISIBLE' : 'CAPA OCULTA'}
                  </button>

                  <label className="capa-color">
                    <span>COLOR DE LA CAPA</span>
                    <input type="color" value={capa.color || info?.color || '#227AE6'} onChange={(event) => cambiarCapa('color', event.target.value)} />
                    {capa.color && (
                      <button className="capa-color-limpiar" type="button" onClick={() => cambiarCapa('color', null)}>
                        USAR EL DEL LOGO
                      </button>
                    )}
                  </label>

                  <div className="prueba-controles">
                    {CONTROLES_CAPA.map((control) => (
                      <label key={control.id}>
                        <span>{control.nombre}<b>{capa[control.id]}{control.unidad || ''}</b></span>
                        <input type="range" min={control.min} max={control.max} value={capa[control.id]} onChange={(event) => cambiarCapa(control.id, Number(event.target.value))} />
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {SECCIONES.filter((item) => item.id === seccion).map((item) => (
          <div key={item.id}>
            <div className="prueba-controles">
              {item.controles.map((control) => (
                <label key={control.id}>
                  <span>{control.nombre}<b>{config[control.id]}{control.unidad || ''}</b></span>
                  <input type="range" min={control.min} max={control.max} step={control.paso || 1} value={config[control.id]} onChange={(event) => cambiar(control.id, event.target.value)} />
                </label>
              ))}
            </div>
            {item.interruptores && (
              <div className="prueba-acciones">
                {item.interruptores.map((interruptor) => (
                  <button
                    className={config[interruptor.id] ? 'prueba-boton is-secundario' : 'prueba-boton is-fantasma'}
                    type="button"
                    onClick={() => alternar(interruptor.id)}
                    aria-pressed={Boolean(config[interruptor.id])}
                    key={interruptor.id}
                  >
                    {interruptor.nombre}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {aviso && <p className="prueba-aviso" role="status">{aviso}</p>}

        <div className="prueba-acciones">
          <button className="prueba-boton" type="button" onClick={guardar}>GUARDAR</button>
          <button className="prueba-boton is-secundario" type="button" onClick={restaurar}>RESTAURAR</button>
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
              <li>En CAPAS puedes reordenarlas, ocultarlas o recolorearlas una por una.</li>
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
