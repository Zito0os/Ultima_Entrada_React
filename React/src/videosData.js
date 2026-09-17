import { historyEvents } from './historyData'

// Los veinte clips de la propuesta. Los archivos van en public/videos con el id
// como nombre. Si uno falta, el reproductor lo avisa y deja importar otro.
export const jugadas = [
  { id: 'jonron-senalado', anio: '1932', evento: 'SERIE MUNDIAL', titulo: 'EL JONRÓN SEÑALADO', equipos: 'Chicago vs New York', duracion: '0:52', tipo: 'jonrones', epoca: 'babe-ruth' },
  { id: 'atrapada-espaldas', anio: '1954', evento: 'SERIE MUNDIAL', titulo: 'LA ATRAPADA DE ESPALDAS', equipos: 'New York vs Cleveland', duracion: '0:41', tipo: 'atrapadas', epoca: 'integracion' },
  { id: 'jonron-cierre', anio: '1993', evento: 'JUEGO 6', titulo: 'JONRÓN PARA CERRAR LA SERIE', equipos: 'Toronto vs Philadelphia', duracion: '1:41', tipo: 'jonrones', epoca: 'expansion' },
  { id: 'out-final', anio: '2016', evento: 'JUEGO 7', titulo: 'EL OUT FINAL TRAS LA LLUVIA', equipos: 'Chicago vs Cleveland', duracion: '1:18', tipo: 'atrapadas', epoca: 'moderna' },
  { id: 'batazo-titulo', anio: '2023', evento: 'JUEGO 5', titulo: 'EL BATAZO DEL TÍTULO', equipos: 'Texas vs Arizona', duracion: '0:57', tipo: 'jonrones', epoca: 'moderna' },
  { id: 'jugada-6', anio: '', evento: 'POR DEFINIR', titulo: 'JUGADA POR DEFINIR', equipos: '', duracion: '', tipo: 'jonrones', epoca: 'moderna' },
  { id: 'jugada-7', anio: '', evento: 'POR DEFINIR', titulo: 'JUGADA POR DEFINIR', equipos: '', duracion: '', tipo: 'atrapadas', epoca: 'expansion' },
  { id: 'jugada-8', anio: '', evento: 'POR DEFINIR', titulo: 'JUGADA POR DEFINIR', equipos: '', duracion: '', tipo: 'jonrones', epoca: 'integracion' },
]

// Dos por epoca, con el id de la epoca y el numero
export const clipsDeEpoca = historyEvents.flatMap((epoca) => (
  Array.from({ length: epoca.videos }, (_, indice) => ({
    id: `${epoca.id}-${indice + 1}`,
    titulo: `${epoca.title} · CLIP ${indice + 1}`,
    epoca: epoca.id,
    periodo: epoca.period,
  }))
))

export function rutaVideo(id) {
  return `${import.meta.env.BASE_URL}videos/${id}.mp4`
}

export function buscarClip(id) {
  return jugadas.find((jugada) => jugada.id === id)
    || clipsDeEpoca.find((clip) => clip.id === id)
    || null
}

export function clipsDe(epocaId) {
  return clipsDeEpoca.filter((clip) => clip.epoca === epocaId)
}
