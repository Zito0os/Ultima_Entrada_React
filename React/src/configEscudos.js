// Valores del personalizador de escudos. Guardarlos y leerlos es tarea de la
// capa de almacen: aqui solo vive lo que no depende de donde se guarde.
export const CONFIG_BASE = {
  profundidad: 16,
  bisel: 1.5,
  segmentos: 4,
  separacion: 6,
  metalico: 25,
  aspereza: 45,
  reflejo: 60,
  emision: 0,
  facetado: 0,
  escala: 100,
  velocidad: 20,
  estabilidad: 70,
  // Permutacion de las capas, de atras hacia adelante. Vacio = orden del SVG.
  orden: [],
  // { [indice de capa]: ajustes que pisan a CAPA_BASE }
  capas: {},
}

// Lo que se puede tocar de una capa suelta. El indice es el del SVG, no el de
// la pila: si se reordena, los ajustes siguen a su capa.
export const CAPA_BASE = {
  visible: true,
  color: null,
  grosor: 100,
  x: 0,
  y: 0,
}

export const SECCIONES = [
  {
    id: 'forma',
    nombre: 'FORMA',
    controles: [
      { id: 'profundidad', nombre: 'PROFUNDIDAD', min: 1, max: 40 },
      { id: 'bisel', nombre: 'BISEL', min: 0, max: 6, paso: 0.5 },
      { id: 'segmentos', nombre: 'SEGMENTOS DE CURVA', min: 2, max: 24 },
      { id: 'separacion', nombre: 'SEPARACIÓN DE CAPAS', min: 0, max: 30 },
    ],
  },
  {
    id: 'material',
    nombre: 'MATERIAL',
    controles: [
      { id: 'metalico', nombre: 'ACABADO METÁLICO', min: 0, max: 100, unidad: '%' },
      { id: 'aspereza', nombre: 'ASPEREZA', min: 0, max: 100, unidad: '%' },
      { id: 'reflejo', nombre: 'REFLEJO DEL ENTORNO', min: 0, max: 100, unidad: '%' },
      { id: 'emision', nombre: 'BRILLO PROPIO', min: 0, max: 100, unidad: '%' },
    ],
    interruptores: [
      { id: 'facetado', nombre: 'SOMBREADO FACETADO' },
    ],
  },
  {
    id: 'ar',
    nombre: 'EN AR',
    controles: [
      { id: 'escala', nombre: 'TAMAÑO EN AR', min: 40, max: 200, unidad: '%' },
      { id: 'velocidad', nombre: 'VELOCIDAD DE GIRO', min: 0, max: 60 },
      { id: 'estabilidad', nombre: 'ESTABILIDAD EN AR', min: 0, max: 100, unidad: '%' },
    ],
  },
]

export const CONTROLES_CAPA = [
  { id: 'grosor', nombre: 'GROSOR DE LA CAPA', min: 10, max: 200, unidad: '%' },
  { id: 'x', nombre: 'CORRIMIENTO HORIZONTAL', min: -20, max: 20 },
  { id: 'y', nombre: 'CORRIMIENTO VERTICAL', min: -20, max: 20 },
]

// base son los ajustes de fabrica del escudo, para los logos que necesitan
// algo distinto del valor comun. Lo guardado por el usuario pisa a los dos.
export function configDe(guardadas, escudoId, base = {}) {
  return { ...CONFIG_BASE, ...base, ...(guardadas[escudoId] || {}) }
}

export function capaDe(config, indice) {
  return { ...CAPA_BASE, ...((config.capas || {})[indice] || {}) }
}

// Devuelve la pila de capas de atras hacia adelante. Si lo guardado ya no
// corresponde con el SVG se cae al orden de dibujo.
export function ordenDe(config, total) {
  const natural = Array.from({ length: total }, (_, indice) => indice)
  const guardado = config.orden
  if (!Array.isArray(guardado) || guardado.length !== total) {
    return natural
  }
  const enteros = guardado.every((valor) => Number.isInteger(valor) && valor >= 0 && valor < total)
  return enteros && new Set(guardado).size === total ? guardado : natural
}

// Mueve una capa un lugar hacia el frente o hacia atras dentro de la pila
export function moverCapa(orden, indice, direccion) {
  const posicion = orden.indexOf(indice)
  const destino = posicion + direccion
  if (posicion < 0 || destino < 0 || destino >= orden.length) {
    return orden
  }
  const copia = [...orden]
  copia[posicion] = copia[destino]
  copia[destino] = indice
  return copia
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
