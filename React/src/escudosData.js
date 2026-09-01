// Logos que se extruyen a 3D y que ademas sirven de marcador para el escaneo
export const escudos = [
  { id: 'mlb', nombre: 'MLB', svg: 'escudos/mlb.svg', fondo: '#FFFFFF' },
  // El monograma viene en negro: se pinta con el color institucional
  { id: 'yankees', nombre: 'YANKEES', svg: 'escudos/yankees.svg', fondo: '#FFFFFF', color: '#142448' },
  { id: 'red-sox', nombre: 'RED SOX', svg: 'escudos/red-sox.svg', fondo: '#FFFFFF' },
  { id: 'astros', nombre: 'ASTROS', svg: 'escudos/astros.svg', fondo: '#FFFFFF' },
]

export function buscarEscudo(id) {
  return escudos.find((escudo) => escudo.id === id) || escudos[0]
}
