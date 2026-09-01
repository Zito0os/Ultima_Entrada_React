import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { buscarEscudo } from './escudosData'
import { cargarSVG, extruirDesdeSVG } from './extruirEscudo'

// La extrusion mide 100 unidades y el marcador de MindAR mide 1
const ESCALA = 0.006

export default function VerEscudoAR() {
  const { escudoId } = useParams()
  const navigate = useNavigate()
  const contenedor = useRef(null)
  const [estado, setEstado] = useState('preparando')
  const [anclado, setAnclado] = useState(false)
  const [error, setError] = useState('')

  const escudo = buscarEscudo(escudoId)

  useEffect(() => {
    const nodo = contenedor.current
    let mindar = null
    let vivo = true

    const arrancar = async () => {
      try {
        const [{ MindARThree }, THREE, datos] = await Promise.all([
          import('mind-ar/dist/mindar-image-three.prod.js'),
          import('three'),
          cargarSVG(`${import.meta.env.BASE_URL}${escudo.svg}`),
        ])
        if (!vivo) {
          return
        }

        mindar = new MindARThree({
          container: nodo,
          imageTargetSrc: `${import.meta.env.BASE_URL}marcadores/${escudo.id}.mind`,
          uiScanning: 'no',
          uiLoading: 'no',
          uiError: 'no',
        })

        const { renderer, scene, camera } = mindar
        scene.add(new THREE.AmbientLight(0xffffff, 1.6))
        const clave = new THREE.DirectionalLight(0xffffff, 2.4)
        clave.position.set(1, 2, 3)
        scene.add(clave)
        const relleno = new THREE.DirectionalLight(0x9ec9ff, 1.2)
        relleno.position.set(-2, -1, 2)
        scene.add(relleno)

        const { objeto } = extruirDesdeSVG(datos, { profundidad: 16, bisel: 1.5, segmentos: 4, separacion: 6, color: escudo.color })
        objeto.scale.multiplyScalar(ESCALA)

        const giro = new THREE.Group()
        giro.add(objeto)

        const ancla = mindar.addAnchor(0)
        ancla.group.add(giro)
        ancla.onTargetFound = () => setAnclado(true)
        ancla.onTargetLost = () => setAnclado(false)

        setEstado('encendiendo')
        await mindar.start()
        if (!vivo) {
          return
        }
        setEstado('buscando')

        renderer.setAnimationLoop(() => {
          giro.rotation.y += 0.02
          renderer.render(scene, camera)
        })
      } catch (fallo) {
        if (!vivo) {
          return
        }
        const nombre = fallo?.name || ''
        if (nombre === 'NotAllowedError' || nombre === 'SecurityError') {
          setError('Diste permiso denegado a la cámara. Habilítala para este sitio y vuelve a entrar.')
        } else if (nombre === 'NotFoundError') {
          setError('Este dispositivo no tiene una cámara disponible.')
        } else if (nombre === 'NotReadableError') {
          setError('Otra aplicación está usando la cámara. Ciérrala e inténtalo de nuevo.')
        } else {
          setError(fallo?.message || 'La cámara necesita una conexión segura (HTTPS) y tu permiso explícito.')
        }
        setEstado('error')
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
    }
  }, [escudo])

  return (
    <main className="ar-ver-shell">
      <div className="ar-ver-camara" ref={contenedor} />

      <div className="ar-ver-marco" aria-hidden="true">
        <span /><span /><span /><span />
      </div>

      <header className="ar-ver-barra">
        <button className="ar-ver-atras" type="button" onClick={() => navigate('/ar/escudos')} aria-label="Salir del escaneo">←</button>
        <span className={anclado ? 'ar-ver-estado is-anclado' : 'ar-ver-estado'}>
          {estado === 'error' ? 'ERROR' : anclado ? 'ANCLADO' : estado === 'buscando' ? 'BUSCANDO ESCUDO...' : estado === 'encendiendo' ? 'ENCENDIENDO CÁMARA...' : 'PREPARANDO...'}
        </span>
        <span className="ar-ver-equipo">{escudo.nombre}</span>
      </header>

      {error && (
        <div className="ar-ver-error" role="alert">
          <strong>No se pudo abrir la cámara</strong>
          <p>{error}</p>
          <button type="button" onClick={() => navigate('/ar/escudos')}>REGRESAR</button>
        </div>
      )}
    </main>
  )
}
