import { teams } from './teamsData'

// Cada equipo tiene su logo en SVG, que se extruye a 3D, y su archivo .mind
// con las variantes que la camara puede reconocer. Los dos comparten el id.
// "marcadores" es cuantas imagenes trae ese .mind: sale de `npm run marcadores`
// y hay que actualizarlo cuando se recompile un marcador.
const ajustes = {
  angels: { marcadores: 4 },
  astros: { marcadores: 3 },
  athletics: { marcadores: 5 },
  'blue-jays': { marcadores: 2 },
  // El SVG dibuja la pelota blanca hasta el final, asi que en 3D quedaba
  // delante y tapaba la costura. Se manda al medio: azul, pelota, costura.
  guardians: { marcadores: 3, config: { orden: [0, 2, 1] } },
  mariners: { marcadores: 3 },
  orioles: { marcadores: 4 },
  rangers: { marcadores: 3 },
  rays: { marcadores: 2 },
  'red-sox': { marcadores: 3 },
  royals: { marcadores: 4 },
  tigers: { marcadores: 3 },
  twins: { marcadores: 3 },
  'white-sox': { marcadores: 2 },
  // El monograma de los Yankees viene en negro: se pinta con el color del club
  yankees: { marcadores: 4, color: '#142448' },
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
