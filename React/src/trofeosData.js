import { finals } from './finalsData'
import { teams } from './teamsData'

// Los 24 trofeos de la coleccion: uno por trivia de equipo, uno por final y
// cinco logros sueltos. El id es el que se guarda en el perfil.
const logros = [
  { id: 'logro-primer-escaneo', nombre: 'PRIMER ESCANEO', pista: 'Escanea un escudo en AR' },
  { id: 'logro-cinco-escudos', nombre: 'CINCO ESCUDOS', pista: 'Escanea cinco equipos distintos' },
  { id: 'logro-album-medio', nombre: 'MEDIO ÁLBUM', pista: 'Junta 23 cartas' },
  { id: 'logro-album-lleno', nombre: 'ÁLBUM LLENO', pista: 'Junta las 45 cartas' },
  { id: 'logro-racha-siete', nombre: 'RACHA DE 7', pista: 'Entra siete días seguidos' },
]

export const trofeos = [
  ...teams.map((team) => ({ id: `trivia-${team.id}`, nombre: team.name, pista: 'Ronda perfecta de trivia', tipo: 'trivia', equipo: team.id })),
  ...finals.map((final) => ({ id: `final-${final.id}`, nombre: `SERIE ${final.year}`, pista: 'Gana la última entrada', tipo: 'final', anio: final.year })),
  ...logros.map((logro) => ({ ...logro, tipo: 'logro' })),
]

export function buscarTrofeo(id) {
  return trofeos.find((trofeo) => trofeo.id === id)
}
