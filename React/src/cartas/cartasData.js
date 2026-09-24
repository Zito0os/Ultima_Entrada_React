import { teams } from '../teamsData'

// lider es el indice en team.bateo: la rareza sube con el ranking historico
export const rarezas = [
  { id: 'comun', nombre: 'COMÚN', peso: 60, lider: 2, pose: 1, orden: 0 },
  { id: 'especial', nombre: 'ESPECIAL', peso: 30, lider: 1, pose: 2, orden: 1 },
  { id: 'holo', nombre: 'HOLOGRÁFICA', peso: 10, lider: 0, pose: 3, orden: 2 },
]

// Color principal y de acento de cada club, para el fondo del arte
const COLORES = {
  yankees: ['#0C2340', '#C4CED3'],
  'red-sox': ['#BD3039', '#0C2340'],
  'blue-jays': ['#134A8E', '#E8291C'],
  rays: ['#092C5C', '#8FBCE6'],
  orioles: ['#DF4601', '#1A1A1A'],
  guardians: ['#00385D', '#E50022'],
  tigers: ['#0C2340', '#FA4616'],
  royals: ['#004687', '#BD9B60'],
  twins: ['#002B5C', '#D31145'],
  'white-sox': ['#27251F', '#C4CED4'],
  astros: ['#002D62', '#EB6E1F'],
  angels: ['#BA0021', '#003263'],
  athletics: ['#003831', '#EFB21E'],
  mariners: ['#0C2C56', '#005C5C'],
  rangers: ['#003278', '#C0111F'],
}

export const TOTAL_CARTAS = teams.length * rarezas.length

// El id no cambia nunca: es la llave de perfil.cartas en los perfiles guardados
export const cartas = teams.flatMap((team, indiceEquipo) => rarezas.map((rareza, indiceRareza) => ({
  id: `${team.id}-${rareza.id}`,
  numero: indiceEquipo * rarezas.length + indiceRareza + 1,
  equipo: team.id,
  nombre: team.name,
  jugador: team.bateo[rareza.lider].name,
  estadio: team.stadium,
  ciudad: team.city,
  rareza: rareza.id,
  rarezaNombre: rareza.nombre,
  pose: rareza.pose,
  colores: COLORES[team.id] || ['#0D3767', '#227AE6'],
})))

export function buscarCarta(id) {
  return cartas.find((carta) => carta.id === id) || null
}

export function buscarRareza(id) {
  return rarezas.find((rareza) => rareza.id === id) || rarezas[0]
}

export function rutaCarta(id) {
  return `${import.meta.env.BASE_URL}cartas/${id}.webp`
}

export const RUTA_DORSO = `${import.meta.env.BASE_URL}cartas/dorso.webp`
export const RUTA_MARCADOR = `${import.meta.env.BASE_URL}cartas/tarjetas.mind`

export function sortearRareza(azar = Math.random) {
  const total = rarezas.reduce((suma, rareza) => suma + rareza.peso, 0)
  let tiro = azar() * total
  for (const rareza of rarezas) {
    tiro -= rareza.peso
    if (tiro < 0) {
      return rareza.id
    }
  }
  return rarezas[0].id
}

// Registro.jsx la usa para las cartas de regalo: conserva la firma de siempre
export function cartaAlAzar(rarezaForzada = null, azar = Math.random) {
  const rareza = rarezaForzada || sortearRareza(azar)
  const candidatas = cartas.filter((carta) => carta.rareza === rareza)
  return candidatas[Math.floor(azar() * candidatas.length)]
}
