// Estadisticas y resultados simulados, tal como pide la rubrica para el prototipo.
export const teams = [
  {
    id: 'yankees',
    name: 'YANKEES',
    titles: 27,
    banners: 41,
    firstTitle: 1923,
    abbreviation: 'NY',
    tone: 'navy',
    region: 'ESTE',
    stadium: 'YANKEE STADIUM',
    city: 'BRONX',
    founded: 1901,
    history: 'Nacieron en Baltimore como Orioles en 1901 y se mudaron a Nueva York dos años después. La llegada de Babe Ruth en 1920 los convirtió en la franquicia dominante del siglo: conquistaron títulos y una racha de cinco seguidos entre 1949 y 1953.',
    serie: {
      titulo: 'SERIE MUNDIAL 1996 · JUEGO 6',
      local: { abreviatura: 'NYY', entradas: [0, 0, 3, 0, 0, 0, 0, 0, '-'] },
      visitante: { abreviatura: 'ATL', entradas: [0, 0, 1, 0, 0, 0, 0, 0, 1] },
    },
    lideres: {
      BATEO: [
        { name: 'BABE RUTH', value: 659, unidad: 'JONRONES' },
        { name: 'MICKEY MANTLE', value: 536, unidad: 'JONRONES' },
        { name: 'LOU GEHRIG', value: 493, unidad: 'JONRONES' },
      ],
      PITCHEO: [
        { name: 'WHITEY FORD', value: 236, unidad: 'GANADOS' },
        { name: 'RED RUFFING', value: 231, unidad: 'GANADOS' },
        { name: 'ANDY PETTITTE', value: 219, unidad: 'GANADOS' },
      ],
      FRANQUICIA: [
        { name: 'SERIES GANADAS', value: 27, unidad: 'TÍTULOS' },
        { name: 'BANDERINES', value: 41, unidad: 'BANDERINES' },
        { name: 'TEMPORADAS', value: 124, unidad: 'AÑOS' },
      ],
    },
  },
  {
    id: 'red-sox',
    name: 'RED SOX',
    titles: 9,
    banners: 14,
    firstTitle: 1903,
    abbreviation: 'B',
    tone: 'red',
    region: 'ESTE',
    stadium: 'FENWAY PARK',
    city: 'BOSTON',
    founded: 1901,
    history: 'Una de las franquicias más queridas del béisbol. Su historia está marcada por Fenway Park, grandes remontadas y una afición que acompaña al equipo en cada temporada.',
    serie: {
      titulo: 'SERIE MUNDIAL 1975 · JUEGO 6',
      local: { abreviatura: 'BOS', entradas: [0, 0, 3, 0, 0, 0, 0, 0, 1] },
      visitante: { abreviatura: 'CIN', entradas: [0, 0, 0, 0, 0, 3, 0, 0, 0] },
    },
    lideres: {
      BATEO: [
        { name: 'TED WILLIAMS', value: 521, unidad: 'JONRONES' },
        { name: 'DAVID ORTIZ', value: 483, unidad: 'JONRONES' },
        { name: 'CARL YASTRZEMSKI', value: 452, unidad: 'JONRONES' },
      ],
      PITCHEO: [
        { name: 'CY YOUNG', value: 192, unidad: 'GANADOS' },
        { name: 'ROGER CLEMENS', value: 192, unidad: 'GANADOS' },
        { name: 'PEDRO MARTÍNEZ', value: 117, unidad: 'GANADOS' },
      ],
      FRANQUICIA: [
        { name: 'SERIES GANADAS', value: 9, unidad: 'TÍTULOS' },
        { name: 'BANDERINES', value: 14, unidad: 'BANDERINES' },
        { name: 'TEMPORADAS', value: 124, unidad: 'AÑOS' },
      ],
    },
  },
  {
    id: 'astros',
    name: 'ASTROS',
    titles: 2,
    banners: 2,
    firstTitle: 2017,
    abbreviation: 'H',
    tone: 'orange',
    region: 'OESTE',
    stadium: 'DAIKIN PARK',
    city: 'HOUSTON',
    founded: 1962,
    history: 'Desde Houston, los Astros construyeron una identidad propia con generaciones de jugadores destacados y una fuerte presencia en la Liga Americana.',
    serie: {
      titulo: 'SERIE MUNDIAL 2017 · JUEGO 5',
      local: { abreviatura: 'HOU', entradas: [4, 0, 0, 4, 0, 0, 3, 0, 2] },
      visitante: { abreviatura: 'LAD', entradas: [0, 0, 4, 0, 3, 0, 4, 0, 1] },
    },
    lideres: {
      BATEO: [
        { name: 'JEFF BAGWELL', value: 449, unidad: 'JONRONES' },
        { name: 'LANCE BERKMAN', value: 326, unidad: 'JONRONES' },
        { name: 'JOSÉ ALTUVE', value: 245, unidad: 'JONRONES' },
      ],
      PITCHEO: [
        { name: 'ROY OSWALT', value: 143, unidad: 'GANADOS' },
        { name: 'JOE NIEKRO', value: 144, unidad: 'GANADOS' },
        { name: 'LARRY DIERKER', value: 137, unidad: 'GANADOS' },
      ],
      FRANQUICIA: [
        { name: 'SERIES GANADAS', value: 2, unidad: 'TÍTULOS' },
        { name: 'BANDERINES', value: 2, unidad: 'BANDERINES' },
        { name: 'TEMPORADAS', value: 63, unidad: 'AÑOS' },
      ],
    },
  },
]

export const regions = ['TODAS', 'ESTE', 'OESTE', 'CENTRAL']
