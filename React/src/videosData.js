import { historyEvents } from './historyData'

// Las ocho mejores jugadas. Los archivos van en public/videos con el id
// como nombre. Si uno falta, el reproductor lo avisa y deja importar otro.
export const jugadas = [
  { id: 'jonron-senalado', anio: '1932', evento: 'SERIE MUNDIAL', titulo: 'EL JONRÓN SEÑALADO', equipos: 'Chicago vs New York', duracion: '0:32', tipo: 'jonrones', epoca: 'babe-ruth' },
  { id: 'atrapada-espaldas', anio: '1954', evento: 'SERIE MUNDIAL', titulo: 'LA ATRAPADA DE ESPALDAS', equipos: 'New York vs Cleveland', duracion: '0:39', tipo: 'atrapadas', epoca: 'integracion' },
  { id: 'jonron-cierre', anio: '1993', evento: 'SERIE MUNDIAL · JUEGO 6', titulo: 'JONRÓN PARA CERRAR LA SERIE', equipos: 'Toronto vs Philadelphia', duracion: '1:11', tipo: 'jonrones', epoca: 'expansion' },
  { id: 'cubs-campeones', anio: '2016', evento: 'SERIE MUNDIAL · JUEGO 7', titulo: 'LOS CUBS ROMPEN LA MALDICIÓN', equipos: 'Chicago vs Cleveland', duracion: '0:41', tipo: 'atrapadas', epoca: 'moderna' },
  { id: 'batazo-titulo', anio: '2023', evento: 'SERIE MUNDIAL · JUEGO 5', titulo: 'EL BATAZO DEL TÍTULO', equipos: 'Texas vs Arizona', duracion: '2:01', tipo: 'jonrones', epoca: 'moderna' },
  { id: 'pase-de-jeter', anio: '2001', evento: 'SERIE DIVISIONAL · JUEGO 3', titulo: 'EL PASE DE JETER', equipos: 'New York vs Oakland', duracion: '0:53', tipo: 'atrapadas', epoca: 'moderna' },
  { id: 'bat-flip-bautista', anio: '2015', evento: 'SERIE DIVISIONAL · JUEGO 5', titulo: 'EL BAT FLIP DE BAUTISTA', equipos: 'Toronto vs Texas', duracion: '0:42', tipo: 'jonrones', epoca: 'moderna' },
  { id: 'tiro-de-ichiro', anio: '2001', evento: 'TEMPORADA REGULAR', titulo: 'EL TIRO LÁSER DE ICHIRO', equipos: 'Seattle vs Oakland', duracion: '1:00', tipo: 'atrapadas', epoca: 'moderna' },
]

// Que trae cada clip de epoca. Si un id no esta aqui se usa el nombre generico.
const TITULOS_EPOCA = {
  'origenes-1': 'THE BALL GAME · EDISON, 1898',
  'origenes-2': 'LOS RED STOCKINGS DE 1869',
  'liga-americana-1': 'TY COBB: BATEO, CARRERA Y ROBO',
  'liga-americana-2': 'SERIE MUNDIAL DE 1919',
  'babe-ruth-1': 'EL JONRÓN 60 DE BABE RUTH, 1927',
  'babe-ruth-2': 'EL DISCURSO DE LOU GEHRIG, 1939',
  'integracion-1': 'EL DEBUT DE JACKIE ROBINSON, 1947',
  'integracion-2': 'LARRY DOBY LLEGA A LA AMERICANA, 1947',
  'expansion-1': 'NOLAN RYAN PONCHA A 12, 1986',
  'expansion-2': 'EL TERCER JONRÓN DE REGGIE, 1977',
  'moderna-1': 'LA HUELGA QUE CANCELÓ 1994',
  'moderna-2': 'RIPKEN ROMPE EL RÉCORD, 1995',
  'moderna-3': 'EL PRIMER JONRÓN DE ICHIRO, 2001',
}

export const clipsDeEpoca = historyEvents.flatMap((epoca) => (
  Array.from({ length: epoca.videos }, (_, indice) => {
    const id = `${epoca.id}-${indice + 1}`
    return {
      id,
      titulo: TITULOS_EPOCA[id] || `${epoca.title} · CLIP ${indice + 1}`,
      epoca: epoca.id,
      periodo: epoca.period,
    }
  })
))

export function rutaVideo(id) {
  return `${import.meta.env.BASE_URL}videos/${id}.mp4`
}

// Un cuadro del propio clip. Si el video no esta cargado el jpg tampoco, y el
// recuadro se queda con su color de fondo.
export function rutaMiniatura(id) {
  return `${import.meta.env.BASE_URL}videos/miniaturas/${id}.jpg`
}

export function buscarClip(id) {
  return jugadas.find((jugada) => jugada.id === id)
    || clipsDeEpoca.find((clip) => clip.id === id)
    || null
}

export function clipsDe(epocaId) {
  return clipsDeEpoca.filter((clip) => clip.epoca === epocaId)
}
