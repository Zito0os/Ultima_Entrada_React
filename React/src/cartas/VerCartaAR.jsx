import { useCallback, useEffect, useRef, useState } from 'react'

import { RUTA_MARCADOR, rarezas } from './cartasData'

import { cargarTexturas, crearCartaHolo } from './holoShader'
import { componerCaptura } from '../efectosAR'
import './ar.css'

// En anchos de tarjeta: MindAR mide el marcador como 1
const SEPARACION = 0.02
// Vueltas por segundo cuando la carta esta girando
const VUELTAS_POR_SEGUNDO = 0.35

// MindAR 1.2.5 atrapa el error de getUserMedia y rechaza sin el: se pide la
// camara antes para saber que paso de verdad. El permiso queda dado y MindAR
// la vuelve a abrir sin preguntar.
async function probarCamara() {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw Object.assign(new Error('Sin acceso a la cámara'), { name: 'SecurityError' })
  }
  const flujo = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: 'environment' } })
  flujo.getTracks().forEach((pista) => pista.stop())
}

function mensajeDeCamara(fallo) {
  const nombre = fallo?.name || ''
  if (nombre === 'NotAllowedError' || nombre === 'SecurityError') {
    return 'Diste permiso denegado a la cámara. Habilítala para este sitio y vuelve a entrar.'
  }
  if (nombre === 'NotFoundError') {
    return 'Este dispositivo no tiene una cámara disponible.'
  }
  if (nombre === 'NotReadableError') {
    return 'Otra aplicación está usando la cámara. Ciérrala e inténtalo de nuevo.'
  }
  return fallo?.message || 'La cámara necesita una conexión segura (HTTPS) y tu permiso explícito.'
}

// La carta se ancla a cualquiera de las tres tarjetas impresas: basta con
// tener una a la mano, sin importar la rareza de la carta elegida
export default function VerCartaAR({ carta, onSalir, onFoto }) {
  const contenedor = useRef(null)
  const motor = useRef(null)
  const [estado, setEstado] = useState('preparando')
  const [anclado, setAnclado] = useState(false)
  const [girando, setGirando] = useState(false)
  const [aviso, setAviso] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const nodo = contenedor.current
    let vivo = true
    let mindar = null
    let modelo = null

    const arrancar = async () => {
      try {
        const [{ MindARThree }, THREE] = await Promise.all([
          import('mind-ar/dist/mindar-image-three.prod.js'),
          import('three'),
        ])
        if (!vivo) {
          return
        }
        mindar = new MindARThree({
          container: nodo,
          imageTargetSrc: RUTA_MARCADOR,
          uiScanning: 'no',
          uiLoading: 'no',
          uiError: 'no',
          filterMinCF: 0.0001,
          filterBeta: 0.001,
          missTolerance: 12,
          warmupTolerance: 3,
        })
        const { renderer, scene, camera } = mindar
        const texturas = await cargarTexturas(THREE, renderer, carta)
        if (!vivo) {
          texturas.frente.dispose()
          texturas.dorso.dispose()
          texturas.mapa.dispose()
          return
        }
        modelo = crearCartaHolo(THREE, { ...texturas, rareza: carta.rareza })

        // El eje va en el centro: la carta da vueltas sobre si misma, como los
        // modelos de los escudos
        const bisagras = rarezas.map((_, indice) => {
          const bisagra = new THREE.Group()
          bisagra.position.set(0, 0, SEPARACION)
          const copia = indice === 0 ? modelo.malla : modelo.malla.clone()
          bisagra.add(copia)
          const ancla = mindar.addAnchor(indice)
          ancla.group.add(bisagra)
          ancla.onTargetFound = () => setAnclado(true)
          ancla.onTargetLost = () => setAnclado(false)
          return bisagra
        })

        motor.current = { mindar, renderer, scene, camera, girando: false }
        setEstado('encendiendo')
        await probarCamara()
        if (!vivo) {
          return
        }
        await mindar.start()
        if (!vivo) {
          return
        }
        setEstado('buscando')

        const reloj = new THREE.Clock()
        // getElapsedTime consume el delta: el tiempo se lleva sumando los pasos
        let segundos = 0
        renderer.setAnimationLoop(() => {
          const paso = reloj.getDelta()
          segundos += paso
          bisagras.forEach((bisagra) => {
            if (motor.current?.girando) {
              bisagra.rotation.y += paso * VUELTAS_POR_SEGUNDO * Math.PI * 2
            } else {
              // Al parar se acomoda de frente, por la vuelta mas cercana
              const vuelta = Math.round(bisagra.rotation.y / (Math.PI * 2)) * Math.PI * 2
              bisagra.rotation.y += (vuelta - bisagra.rotation.y) * 0.12
            }
            bisagra.position.z = SEPARACION + Math.sin(segundos * 1.6) * 0.006
          })
          modelo.animar(segundos)
          renderer.render(scene, camera)
        })
      } catch (fallo) {
        if (vivo) {
          setError(mensajeDeCamara(fallo))
          setEstado('error')
        }
      }
    }

    arrancar()

    return () => {
      vivo = false
      if (mindar) {
        try {
          mindar.renderer.setAnimationLoop(null)
          mindar.stop()
        } catch {
          // la camara ya estaba apagada
        }
      }
      modelo?.liberar()
      motor.current = null
    }
  }, [carta])

  useEffect(() => {
    if (motor.current) {
      motor.current.girando = girando
    }
  }, [girando])

  // Hay que redibujar justo antes de leer el lienzo o sale vacio
  const tomarFoto = useCallback(() => {
    const actual = motor.current
    if (!actual) {
      return
    }
    actual.renderer.render(actual.scene, actual.camera)
    const foto = componerCaptura(actual.mindar.video, actual.renderer.domElement)
    foto.toBlob((blob) => {
      const enlace = document.createElement('a')
      enlace.href = URL.createObjectURL(blob)
      enlace.download = `ultima-entrada-${carta.id}.png`
      enlace.click()
      onFoto?.(carta)
      setAviso('Foto guardada con la carta incluida.')
      setTimeout(() => setAviso(''), 3000)
    }, 'image/png')
  }, [carta, onFoto])

  const rotulo = estado === 'error' ? 'ERROR'
    : anclado ? 'ANCLADA'
      : estado === 'buscando' ? 'BUSCANDO TARJETA...'
        : estado === 'encendiendo' ? 'ENCENDIENDO CÁMARA...' : 'PREPARANDO...'

  return (
    <main className="ar-carta">
      <div className="ar-carta__camara" ref={contenedor} />
      {!anclado && <div className="ar-carta__marco" aria-hidden="true"><span /><span /><span /><span /></div>}

      <header className="ar-carta__barra">
        <button className="ar-carta__salir" type="button" onClick={onSalir}>SALIR</button>
        <span className={anclado ? 'ar-carta__estado is-anclada' : 'ar-carta__estado'} role="status">{rotulo}</span>
      </header>

      {estado === 'buscando' && !anclado && (
        <p className="ar-carta__pista">Apunta a cualquiera de tus tres tarjetas impresas, con buena luz</p>
      )}
      {aviso && <p className="ar-carta__aviso" role="status">{aviso}</p>}

      <footer className="ar-carta__controles">
        <strong>{carta.jugador} · {carta.rarezaNombre}</strong>
        <div className="ar-carta__acciones">
          <button className={girando ? 'ar-carta__accion is-activa' : 'ar-carta__accion'} type="button" aria-pressed={girando} onClick={() => setGirando((antes) => !antes)} disabled={!anclado}>
            {girando ? 'PARAR' : 'GIRAR'}
          </button>
          <button className="ar-carta__accion" type="button" onClick={tomarFoto} disabled={estado !== 'buscando'}>FOTO</button>
        </div>
      </footer>

      {error && (
        <div className="ar-carta__error" role="alert">
          <strong>No se pudo abrir la cámara</strong>
          <p>{error}</p>
          <button type="button" onClick={onSalir}>REGRESAR</button>
        </div>
      )}
    </main>
  )
}
