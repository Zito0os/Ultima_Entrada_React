// Valores del personalizador de escudos. Guardarlos y leerlos es tarea de la
// capa de almacen: aqui solo vive lo que no depende de donde se guarde.
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

export function configDe(guardadas, escudoId) {
  return { ...CONFIG_BASE, ...(guardadas[escudoId] || {}) }
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
