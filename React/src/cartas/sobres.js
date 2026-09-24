import { buscarRareza, cartaAlAzar, rarezas } from './cartasData'

export const MONEDAS_POR_REPETIDA = 15

export const sobres = [
  { id: 'bronze', nombre: 'SOBRE BRONCE', precio: 100, cantidad: 3, garantiza: null, tono: 'bronce' },
  { id: 'silver', nombre: 'SOBRE PLATA', precio: 250, cantidad: 5, garantiza: 'especial', tono: 'plata' },
  { id: 'gold', nombre: 'SOBRE ORO', precio: 500, cantidad: 5, garantiza: 'holo', tono: 'oro' },
]

export function buscarSobre(id) {
  return sobres.find((sobre) => sobre.id === id) || null
}

export function describirSobre(sobre) {
  const garantia = sobre.garantiza ? ` · 1 ${buscarRareza(sobre.garantiza).nombre.toLowerCase()} garantizada` : ''
  return `${sobre.cantidad} cartas${garantia}`
}

// Probabilidad de que al menos una carta del sobre salga de cada rareza, para
// mostrarla antes de comprar como pide la propuesta
export function probabilidades(sobre) {
  const total = rarezas.reduce((suma, rareza) => suma + rareza.peso, 0)
  const libres = sobre.garantiza ? sobre.cantidad - 1 : sobre.cantidad
  return rarezas.map((rareza) => {
    if (rareza.id === sobre.garantiza) {
      return { ...rareza, porcentaje: 100 }
    }
    const ninguna = (1 - rareza.peso / total) ** libres
    return { ...rareza, porcentaje: Math.round((1 - ninguna) * 100) }
  })
}

// Las cartas salen de menor a mayor rareza, como en los sobres fisicos: la
// mejor siempre queda al final
export function sortearSobre(sobre, azar = Math.random) {
  const sacadas = Array.from({ length: sobre.cantidad }, () => cartaAlAzar(null, azar))
  if (sobre.garantiza) {
    sacadas[sacadas.length - 1] = cartaAlAzar(sobre.garantiza, azar)
  }
  return sacadas.sort((a, b) => buscarRareza(a.rareza).orden - buscarRareza(b.rareza).orden)
}

// Marca cuales son nuevas contra el album de antes y dentro del mismo sobre
export function resolverSobre(sacadas, cartasPrevias) {
  const vistas = new Set(Object.keys(cartasPrevias).filter((id) => cartasPrevias[id] > 0))
  const cartas = sacadas.map((carta) => {
    const nueva = !vistas.has(carta.id)
    vistas.add(carta.id)
    return { ...carta, nueva }
  })
  const repetidas = cartas.filter((carta) => !carta.nueva).length
  return { cartas, repetidas, monedasExtra: repetidas * MONEDAS_POR_REPETIDA }
}
