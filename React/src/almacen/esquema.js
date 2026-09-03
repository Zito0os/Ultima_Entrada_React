// Forma unica del perfil de un jugador. Todo lo que la app guarda vive aqui:
// si algo no esta en este objeto, no se persiste.
export const VERSION = 1

export const MONEDAS_INICIALES = 340
export const TROFEOS_TOTAL = 24
export const CARTAS_TOTAL = 45
export const HOLO_TOTAL = 15

export const PERFIL_BASE = {
  version: VERSION,
  cuenta: { usuario: '', correo: '', invitado: true, creada: null },
  monedas: MONEDAS_INICIALES,
  racha: { dias: 0, ultimoDia: '' },
  // ids de trofeosData que ya se ganaron
  trofeos: [],
  // { [cartaId]: cantidad }, las repetidas suben el contador
  cartas: {},
  // { [equipoId]: { mejor, jugadas } }
  trivia: {},
  // { [finalId]: { ganada, lanzamientos } }
  finales: {},
  // { [escudoId]: config del personalizador }
  escudos: {},
  // { id, nombre, editada, creada }
  galeria: [],
  preferencias: { onboardingModelos: false },
  actualizado: null,
}

// Rellena lo que falte para que una version vieja del perfil no rompa pantallas
export function normalizar(guardado) {
  if (!guardado || typeof guardado !== 'object') {
    return { ...PERFIL_BASE }
  }
  return {
    ...PERFIL_BASE,
    ...guardado,
    version: VERSION,
    cuenta: { ...PERFIL_BASE.cuenta, ...(guardado.cuenta || {}) },
    racha: { ...PERFIL_BASE.racha, ...(guardado.racha || {}) },
    trofeos: Array.isArray(guardado.trofeos) ? guardado.trofeos : [],
    cartas: guardado.cartas || {},
    trivia: guardado.trivia || {},
    finales: guardado.finales || {},
    escudos: guardado.escudos || {},
    galeria: Array.isArray(guardado.galeria) ? guardado.galeria : [],
    preferencias: { ...PERFIL_BASE.preferencias, ...(guardado.preferencias || {}) },
  }
}

export function hoy() {
  return new Date().toISOString().slice(0, 10)
}
