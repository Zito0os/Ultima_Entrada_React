const GRAVEDAD = 0.34

// Confeti en un canvas. Devuelve una funcion que lo detiene y limpia.
// La fisica va por tiempo transcurrido: a 120 Hz no cae al doble de rapido.
export function lanzarConfeti(lienzo, { colores, cantidad = 170, duracion = 2800, origenY = 0.42 } = {}) {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return () => {}
  }
  const ctx = lienzo.getContext('2d')
  const escala = Math.min(window.devicePixelRatio || 1, 2)
  const { width, height } = lienzo.getBoundingClientRect()
  lienzo.width = width * escala
  lienzo.height = height * escala
  ctx.scale(escala, escala)

  const piezas = Array.from({ length: cantidad }, () => ({
    x: width / 2 + (Math.random() - 0.5) * width * 0.2,
    y: height * origenY,
    vx: (Math.random() - 0.5) * 15,
    vy: -7 - Math.random() * 13,
    giro: Math.random() * Math.PI,
    vgiro: (Math.random() - 0.5) * 0.32,
    ancho: 6 + Math.random() * 6,
    alto: 9 + Math.random() * 9,
    color: colores[Math.floor(Math.random() * colores.length)],
  }))

  const inicio = performance.now()
  let anterior = inicio
  let cuadro = 0

  const paso = (ahora) => {
    const pasos = Math.min(3, (ahora - anterior) / 16.67)
    anterior = ahora
    const transcurrido = ahora - inicio
    ctx.clearRect(0, 0, width, height)
    ctx.globalAlpha = Math.min(1, Math.max(0, (duracion - transcurrido) / (duracion * 0.35)))
    for (const pieza of piezas) {
      pieza.vy += GRAVEDAD * pasos
      pieza.vx *= 0.992 ** pasos
      pieza.x += pieza.vx * pasos
      pieza.y += pieza.vy * pasos
      pieza.giro += pieza.vgiro * pasos
      ctx.save()
      ctx.translate(pieza.x, pieza.y)
      ctx.rotate(pieza.giro)
      ctx.fillStyle = pieza.color
      // Al girar se ve de canto: asi aletea en vez de caer plano
      const aleteo = Math.abs(Math.cos(pieza.giro * 2))
      ctx.fillRect(-pieza.ancho / 2, (-pieza.alto / 2) * aleteo, pieza.ancho, pieza.alto * aleteo)
      ctx.restore()
    }
    cuadro = transcurrido < duracion ? requestAnimationFrame(paso) : 0
    if (!cuadro) {
      ctx.clearRect(0, 0, width, height)
    }
  }
  cuadro = requestAnimationFrame(paso)

  return () => {
    cancelAnimationFrame(cuadro)
    ctx.clearRect(0, 0, width, height)
  }
}
