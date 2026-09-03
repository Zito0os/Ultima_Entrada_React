import * as THREE from 'three'

const CANTIDAD = 140

// Celebracion que envuelve al escudo: particulas, un anillo y un pulso de luz.
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
    size: medida * 0.07,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
    depthTest: false,
  }))
  grupo.add(particulas)

  // Anillo que late alrededor del escudo
  const anillo = new THREEModulo.Mesh(
    new THREEModulo.TorusGeometry(radio * 1.05, medida * 0.018, 8, 48),
    new THREEModulo.MeshBasicMaterial({ color: 0xF5C64B, transparent: true, opacity: 0.75, depthWrite: false, depthTest: false }),
  )
  grupo.add(anillo)

  const luz = new THREEModulo.PointLight(0xFFD98A, 0, medida * 4)
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
    const pulso = 1 + Math.sin(reloj) * 0.08
    anillo.scale.set(pulso, pulso, 1)
    anillo.material.opacity = 0.5 + Math.sin(reloj) * 0.25
    luz.intensity = 1.8 + Math.sin(reloj * 1.6) * 1.2
  }

  return { grupo, particulas: grupo, animar }
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
