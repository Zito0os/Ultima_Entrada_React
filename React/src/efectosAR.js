import * as THREE from 'three'

const CANTIDAD = 140
// En pixeles del lienzo. Con sizeAttenuation el tamano se mide en unidades del
// mundo, y el mundo de MindAR esta en pixeles del video: las particulas salian
// de milesimas de pixel y no se veian en la camara.
const TAMANO_PUNTO = 9

// Textura de un punto redondo con halo, para que no se vean como cuadros
function crearChispa(THREEModulo) {
  const lienzo = document.createElement('canvas')
  lienzo.width = 64
  lienzo.height = 64
  const ctx = lienzo.getContext('2d')
  const brillo = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  brillo.addColorStop(0, 'rgba(255,255,255,1)')
  brillo.addColorStop(0.35, 'rgba(255,226,150,0.9)')
  brillo.addColorStop(1, 'rgba(255,200,80,0)')
  ctx.fillStyle = brillo
  ctx.fillRect(0, 0, 64, 64)
  return new THREEModulo.CanvasTexture(lienzo)
}

// Celebracion que envuelve al escudo: particulas doradas y un pulso de luz.
// La medida se pasa en unidades del escudo para que sirva igual en AR y en el visor.
export function crearEfectos(THREEModulo = THREE, medida = 1) {
  const grupo = new THREEModulo.Group()
  grupo.visible = false

  const radio = medida * 0.85
  const posiciones = new Float32Array(CANTIDAD * 3)
  const velocidades = new Float32Array(CANTIDAD)

  for (let i = 0; i < CANTIDAD; i += 1) {
    const angulo = Math.random() * Math.PI * 2
    const distancia = radio * (0.35 + Math.random() * 0.75)
    posiciones[i * 3] = Math.cos(angulo) * distancia
    posiciones[i * 3 + 1] = (Math.random() - 0.5) * radio * 2
    posiciones[i * 3 + 2] = Math.sin(angulo) * distancia
    velocidades[i] = medida * (0.004 + Math.random() * 0.012)
  }

  const geometria = new THREEModulo.BufferGeometry()
  geometria.setAttribute('position', new THREEModulo.BufferAttribute(posiciones, 3))

  const particulas = new THREEModulo.Points(geometria, new THREEModulo.PointsMaterial({
    color: 0xF5C64B,
    map: crearChispa(THREEModulo),
    size: TAMANO_PUNTO,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0.95,
    blending: THREEModulo.AdditiveBlending,
    depthWrite: false,
    depthTest: false,
  }))
  grupo.add(particulas)

  // Sin distancia para que no dependa de la escala del mundo, que cambia entre
  // el visor y el AR
  const luz = new THREEModulo.PointLight(0xFFD98A, 0, 0)
  grupo.add(luz)

  let reloj = 0
  const animar = () => {
    if (!grupo.visible) {
      return
    }
    reloj += 0.05

    const puntos = geometria.attributes.position.array
    for (let i = 0; i < CANTIDAD; i += 1) {
      puntos[i * 3 + 1] += velocidades[i]
      if (puntos[i * 3 + 1] > radio) {
        puntos[i * 3 + 1] = -radio
      }
    }
    geometria.attributes.position.needsUpdate = true

    grupo.rotation.y += 0.008
    particulas.material.opacity = 0.7 + Math.sin(reloj) * 0.25
    luz.intensity = 0.5 + Math.sin(reloj * 1.6) * 0.35
  }

  return { grupo, particulas, animar }
}

// Junta el cuadro de la camara con lo que dibujo three encima
export function componerCaptura(video, lienzoWebGL) {
  const salida = document.createElement('canvas')
  salida.width = lienzoWebGL.width
  salida.height = lienzoWebGL.height
  const ctx = salida.getContext('2d')

  const proporcion = salida.width / lienzoWebGL.clientWidth
  const ancho = parseFloat(video.style.width) * proporcion
  const alto = parseFloat(video.style.height) * proporcion
  const x = parseFloat(video.style.left || 0) * proporcion
  const y = parseFloat(video.style.top || 0) * proporcion

  ctx.drawImage(video, x, y, ancho, alto)
  ctx.drawImage(lienzoWebGL, 0, 0)

  return salida
}
