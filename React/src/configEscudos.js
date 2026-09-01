const CLAVE = 'ue_config_escudos'
const CLAVE_ONBOARDING = 'ue_modelos_visto'

export const CONFIG_BASE = {
  profundidad: 16,
  bisel: 1.5,
  segmentos: 4,
  separacion: 6,
  metalico: 25,
  aspereza: 45,
  escala: 100,
  velocidad: 20,
  estabilidad: 70,
}

function leerTodo() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE) || '{}')
  } catch {
    return {}
  }
}

export function leerConfig(escudoId) {
  return { ...CONFIG_BASE, ...(leerTodo()[escudoId] || {}) }
}

export function guardarConfig(escudoId, config) {
  try {
    const todo = leerTodo()
    todo[escudoId] = config
    localStorage.setItem(CLAVE, JSON.stringify(todo))
    return true
  } catch {
    return false
  }
}

export function borrarConfig(escudoId) {
  try {
    const todo = leerTodo()
    delete todo[escudoId]
    localStorage.setItem(CLAVE, JSON.stringify(todo))
  } catch {
    // sin almacenamiento no hay nada que borrar
  }
}

export function tieneConfig(escudoId) {
  return Boolean(leerTodo()[escudoId])
}

// La estabilidad va de 0 a 100 y se traduce al filtro de un euro de MindAR.
// Menos beta significa menos temblor pero un poco mas de retraso al mover.
export function filtroDeEstabilidad(estabilidad) {
  const t = Math.min(100, Math.max(0, estabilidad)) / 100
  return {
    filterMinCF: 0.001 - t * 0.0009,
    filterBeta: 1000 - t * 995,
  }
}

export function onboardingVisto() {
  try {
    return localStorage.getItem(CLAVE_ONBOARDING) === '1'
  } catch {
    return false
  }
}

export function marcarOnboardingVisto() {
  try {
    localStorage.setItem(CLAVE_ONBOARDING, '1')
  } catch {
    // sin almacenamiento se vuelve a mostrar, no es un error
  }
}
