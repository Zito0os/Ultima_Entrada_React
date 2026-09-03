import { teams } from './teamsData'

// Cada equipo tiene su logo en SVG, que se extruye a 3D, y su archivo .mind
// con las variantes que la camara puede reconocer. Los dos comparten el id.
const ajustes = {
  // El monograma de los Yankees viene en negro: se pinta con el color del club
  yankees: { color: '#142448' },
}

export const escudos = teams.map((team) => ({
  id: team.id,
  nombre: team.name,
  equipo: team.id,
  svg: `escudos/${team.id}.svg`,
  fondo: '#FFFFFF',
  marcadores: 1,
  ...(ajustes[team.id] || {}),
}))

export function buscarEscudo(id) {
  return escudos.find((escudo) => escudo.id === id) || escudos[0]
}

export function rutaEscudo(id) {
  return `${import.meta.env.BASE_URL}escudos/${id}.svg`
}
