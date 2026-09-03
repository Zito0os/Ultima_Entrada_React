import { teams } from './teamsData'

// 45 cartas: una comun, una especial y una holografica por cada uno de los 15
// clubes. Cuando existan los jugadores reales solo cambia este archivo.
export const rarezas = [
  { id: 'comun', nombre: 'COMÚN', peso: 60 },
  { id: 'especial', nombre: 'ESPECIAL', peso: 30 },
  { id: 'holo', nombre: 'HOLOGRÁFICA', peso: 10 },
]

export const cartas = teams.flatMap((team) => rarezas.map((rareza) => ({
  id: `${team.id}-${rareza.id}`,
  equipo: team.id,
  nombre: team.name,
  rareza: rareza.id,
  rarezaNombre: rareza.nombre,
})))

export function buscarCarta(id) {
  return cartas.find((carta) => carta.id === id)
}

// Saca una carta al azar respetando el peso de cada rareza
export function cartaAlAzar(rarezaForzada = null) {
  const rareza = rarezaForzada || sortearRareza()
  const candidatas = cartas.filter((carta) => carta.rareza === rareza)
  return candidatas[Math.floor(Math.random() * candidatas.length)]
}

function sortearRareza() {
  const total = rarezas.reduce((suma, rareza) => suma + rareza.peso, 0)
  let tiro = Math.random() * total
  for (const rareza of rarezas) {
    tiro -= rareza.peso
    if (tiro <= 0) {
      return rareza.id
    }
  }
  return 'comun'
}
