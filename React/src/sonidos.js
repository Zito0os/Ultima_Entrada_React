// Los cinco sonidos de la propuesta, sintetizados con Web Audio. No hay
// archivos: cero peso de descarga y ningun problema de licencias.

let contexto = null

function ctx() {
  if (!contexto) {
    const Audio = window.AudioContext || window.webkitAudioContext
    contexto = Audio ? new Audio() : null
  }
  // Los navegadores arrancan el audio suspendido hasta el primer gesto
  if (contexto?.state === 'suspended') {
    contexto.resume()
  }
  return contexto
}

// Un tono con envolvente, que es lo que evita el chasquido al cortar
function tono({ frecuencia, desde = frecuencia, duracion, tipo = 'sine', volumen = 0.2, retraso = 0 }) {
  const audio = ctx()
  if (!audio) {
    return
  }
  const t = audio.currentTime + retraso
  const osc = audio.createOscillator()
  const ganancia = audio.createGain()
  osc.type = tipo
  osc.frequency.setValueAtTime(desde, t)
  if (frecuencia !== desde) {
    osc.frequency.exponentialRampToValueAtTime(frecuencia, t + duracion)
  }
  ganancia.gain.setValueAtTime(0.0001, t)
  ganancia.gain.exponentialRampToValueAtTime(volumen, t + 0.01)
  ganancia.gain.exponentialRampToValueAtTime(0.0001, t + duracion)
  osc.connect(ganancia).connect(audio.destination)
  osc.start(t)
  osc.stop(t + duracion + 0.02)
}

// Golpe corto de ruido, para el contacto del bate
function golpe() {
  const audio = ctx()
  if (!audio) {
    return
  }
  const muestras = Math.floor(audio.sampleRate * 0.12)
  const buffer = audio.createBuffer(1, muestras, audio.sampleRate)
  const datos = buffer.getChannelData(0)
  for (let i = 0; i < muestras; i += 1) {
    datos[i] = (Math.random() * 2 - 1) * (1 - i / muestras) ** 3
  }
  const fuente = audio.createBufferSource()
  fuente.buffer = buffer
  const filtro = audio.createBiquadFilter()
  filtro.type = 'bandpass'
  filtro.frequency.value = 1800
  const ganancia = audio.createGain()
  ganancia.gain.value = 0.35
  fuente.connect(filtro).connect(ganancia).connect(audio.destination)
  fuente.start()
}

// Ruido que sube de tono: el papel del sobre al rasgarse
function rasgado() {
  const audio = ctx()
  if (!audio) {
    return
  }
  const duracion = 0.32
  const muestras = Math.floor(audio.sampleRate * duracion)
  const buffer = audio.createBuffer(1, muestras, audio.sampleRate)
  const datos = buffer.getChannelData(0)
  for (let i = 0; i < muestras; i += 1) {
    // Rafagas cortas en vez de ruido parejo: suena a fibras que se rompen
    const rafaga = Math.random() > 0.55 ? 1 : 0.25
    datos[i] = (Math.random() * 2 - 1) * rafaga * (1 - i / muestras) ** 1.5
  }
  const fuente = audio.createBufferSource()
  fuente.buffer = buffer
  const filtro = audio.createBiquadFilter()
  filtro.type = 'bandpass'
  filtro.Q.value = 0.9
  filtro.frequency.setValueAtTime(900, audio.currentTime)
  filtro.frequency.exponentialRampToValueAtTime(3800, audio.currentTime + duracion)
  const ganancia = audio.createGain()
  ganancia.gain.value = 0.4
  fuente.connect(filtro).connect(ganancia).connect(audio.destination)
  fuente.start()
}

const receta = {
  rasgar: () => {
    rasgado()
  },
  bate: () => {
    golpe()
    tono({ desde: 420, frecuencia: 180, duracion: 0.16, tipo: 'triangle', volumen: 0.25 })
  },
  moneda: () => {
    tono({ frecuencia: 988, duracion: 0.09, tipo: 'square', volumen: 0.12 })
    tono({ frecuencia: 1319, duracion: 0.16, tipo: 'square', volumen: 0.12, retraso: 0.07 })
  },
  carta: () => {
    tono({ desde: 300, frecuencia: 1200, duracion: 0.32, tipo: 'sine', volumen: 0.16 })
  },
  // El sobre al abrirse: el papel, el aire que sale y un brillo corto encima
  sobre: () => {
    rasgado()
    tono({ desde: 150, frecuencia: 560, duracion: 0.5, tipo: 'sine', volumen: 0.16, retraso: 0.06 })
    tono({ frecuencia: 1568, duracion: 0.24, tipo: 'triangle', volumen: 0.09, retraso: 0.2 })
  },
  // Cada rareza suena distinto al voltearse: se oye lo que te toco
  especial: () => {
    tono({ desde: 300, frecuencia: 1200, duracion: 0.3, tipo: 'sine', volumen: 0.14 })
    tono({ frecuencia: 784, duracion: 0.16, tipo: 'sine', volumen: 0.16, retraso: 0.08 })
    tono({ frecuencia: 1047, duracion: 0.28, tipo: 'sine', volumen: 0.14, retraso: 0.17 })
  },
  holo: () => {
    tono({ desde: 300, frecuencia: 1200, duracion: 0.3, tipo: 'sine', volumen: 0.12 })
    const escala = [1047, 1319, 1568, 2093]
    escala.forEach((frecuencia, n) => tono({ frecuencia, duracion: 0.34, tipo: 'triangle', volumen: 0.1, retraso: 0.08 + n * 0.07 }))
  },
  // El reloj de la trivia: un tic seco por segundo, mas alto al final
  tic: () => {
    tono({ frecuencia: 1200, duracion: 0.05, tipo: 'square', volumen: 0.06 })
  },
  ticUrgente: () => {
    tono({ frecuencia: 1600, duracion: 0.07, tipo: 'square', volumen: 0.12 })
  },
  tiempo: () => {
    tono({ desde: 700, frecuencia: 180, duracion: 0.5, tipo: 'sawtooth', volumen: 0.18 })
  },
  acierto: () => {
    tono({ frecuencia: 660, duracion: 0.12, tipo: 'sine', volumen: 0.2 })
    tono({ frecuencia: 880, duracion: 0.22, tipo: 'sine', volumen: 0.2, retraso: 0.1 })
  },
  fallo: () => {
    tono({ desde: 330, frecuencia: 120, duracion: 0.3, tipo: 'sawtooth', volumen: 0.16 })
  },
}

let silenciado = false

export function sonar(nombre) {
  if (silenciado) {
    return
  }
  try {
    receta[nombre]?.()
  } catch {
    // si el navegador no deja sonar, la accion sigue funcionando igual
  }
}

export function silenciar(valor) {
  silenciado = valor
}

export const NOMBRES_SONIDO = Object.keys(receta)
