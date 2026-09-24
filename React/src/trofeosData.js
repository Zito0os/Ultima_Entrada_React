import { finals } from './finalsData'
import { teams } from './teamsData'
import { epocasDe } from './triviaData'

// La coleccion: uno por epoca de trivia, uno por completar las tres epocas de
// un equipo, uno por final y cinco logros sueltos. El id se guarda en el perfil.
// `placa` es la linea chica que va grabada arriba del nombre en el trofeo 3D.
const logros = [
  { id: 'logro-primer-escaneo', nombre: 'PRIMER ESCANEO', pista: 'Escanea un escudo en AR' },
  { id: 'logro-cinco-escudos', nombre: 'CINCO ESCUDOS', pista: 'Escanea cinco equipos distintos' },
  { id: 'logro-album-medio', nombre: 'MEDIO ÁLBUM', pista: 'Junta 23 cartas' },
  { id: 'logro-album-lleno', nombre: 'ÁLBUM LLENO', pista: 'Junta las 45 cartas' },
  { id: 'logro-racha-siete', nombre: 'RACHA DE 7', pista: 'Entra siete días seguidos' },
]

export const trofeos = [
  ...teams.flatMap((team) => epocasDe(team.id).map((epoca) => ({
    id: `trivia-${team.id}-${epoca.id}`,
    nombre: epoca.nombre,
    pista: `Ronda perfecta · ${team.name} ${epoca.anios}`,
    placa: `${team.name} · ${epoca.anios}`,
    tipo: 'trivia',
    equipo: team.id,
  }))),
  ...teams.map((team) => ({ id: `trivia-${team.id}`, nombre: team.name, pista: 'Las tres épocas del equipo', placa: 'TRIVIA · LAS TRES ÉPOCAS', tipo: 'trivia-equipo', equipo: team.id })),
  ...finals.map((final) => ({ id: `final-${final.id}`, nombre: `SERIE ${final.year}`, pista: 'Gana la última entrada', placa: final.serie, tipo: 'final', anio: final.year })),
  ...logros.map((logro) => ({ ...logro, placa: 'ÚLTIMA ENTRADA · LOGRO', tipo: 'logro' })),
]

// El total se calcula, no se escribe a mano: al agregar finales o equipos
// la cabecera y el perfil se ajustan solos
export const TOTAL_TROFEOS = trofeos.length

export function buscarTrofeo(id) {
  return trofeos.find((trofeo) => trofeo.id === id)
}
