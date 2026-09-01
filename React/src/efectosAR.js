import * as THREE from 'three'

const CANTIDAD = 90

// Nube de particulas de celebracion que envuelve al escudo
export function crearEfectos(THREEModulo = THREE) {
  const posiciones = new Float32Array(CANTIDAD * 3)
  const velocidades = new Float32Array(CANTIDAD)

  for (let i = 0; i < CANTIDAD; i += 1) {
    posiciones[i * 3] = (Math.random() - 0.5) * 1.6
    posiciones[i * 3 + 1] = (Math.random() - 0.5) * 1.6
    posiciones[i * 3 + 2] = Math.random() * 0.8
    velocidades[i] = 0.002 + Math.random() * 0.006
  }

  const geometria = new THREEModulo.BufferGeometry()
  geometria.setAttribute('position', new THREEModulo.BufferAttribute(posiciones, 3))

  const particulas = new THREEModulo.Points(geometria, new THREEModulo.PointsMaterial({
    color: 0xF5C64B,
    size: 0.045,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
  }))
  particulas.visible = false

  const animar = () => {
    if (!particulas.visible) {
      return
    }
    const puntos = geometria.attributes.position.array
    for (let i = 0; i < CANTIDAD; i += 1) {
      puntos[i * 3 + 1] += velocidades[i]
      if (puntos[i * 3 + 1] > 0.9) {
        puntos[i * 3 + 1] = -0.9
      }
    }
    geometria.attributes.position.needsUpdate = true
    particulas.rotation.z += 0.003
  }

  return { particulas, animar }
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
