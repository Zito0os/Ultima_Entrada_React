// Logos que se extruyen a 3D y que ademas sirven de marcador para el escaneo.
// marcadores = cuantas variantes trae el archivo .mind de ese equipo.
// equipo = id en teamsData, para poder saltar a su ficha desde la ventana AR.
export const escudos = [
  { id: 'mlb', nombre: 'MLB', svg: 'escudos/mlb.svg', fondo: '#FFFFFF', marcadores: 1 },
  // El monograma viene en negro: se pinta con el color institucional
  { id: 'yankees', nombre: 'YANKEES', svg: 'escudos/yankees.svg', fondo: '#FFFFFF', color: '#142448', marcadores: 1, equipo: 'yankees' },
  { id: 'red-sox', nombre: 'RED SOX', svg: 'escudos/red-sox.svg', fondo: '#FFFFFF', marcadores: 1, equipo: 'red-sox' },
  { id: 'astros', nombre: 'ASTROS', svg: 'escudos/astros.svg', fondo: '#FFFFFF', marcadores: 1, equipo: 'astros' },
]

export function buscarEscudo(id) {
  return escudos.find((escudo) => escudo.id === id) || escudos[0]
}
