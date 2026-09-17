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

const receta = {
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
