// Las siete finales de la propuesta. En cada una un club es de la Liga
// Americana y tiene su escudo en public/escudos; el rival es de la Nacional y
// vive aqui con su propio archivo y color.
//
// "abre" es cuantos trofeos hay que juntar para desbloquearla.
// "bases" es el estado inicial del minijuego: primera, segunda y tercera.
export const finals = [
  {
    id: '1975',
    year: '1975',
    serie: 'SERIE MUNDIAL 1975 · JUEGO 6',
    local: { escudo: 'red-sox', nombre: 'RED SOX', abrev: 'BOS', ciudad: 'Boston' },
    rival: { escudo: 'reds', nombre: 'REDS', abrev: 'CIN', ciudad: 'Cincinnati', color: '#C6011F' },
    situacion: 'Cierre del 9° · empate 6-6 · dos outs',
    descripcion: 'El juego más recordado de los setenta. Boston necesita una carrera para forzar el séptimo.',
    carreras: { local: 6, rival: 6 },
    outs: 2,
    bases: [false, true, false],
    abre: 0,
  },
  {
    id: '1991',
    year: '1991',
    serie: 'SERIE MUNDIAL 1991 · JUEGO 7',
    local: { escudo: 'twins', nombre: 'TWINS', abrev: 'MIN', ciudad: 'Minnesota' },
    rival: { escudo: 'braves', nombre: 'BRAVES', abrev: 'ATL', ciudad: 'Atlanta', color: '#13274F' },
    situacion: 'Cierre del 10° · sin carreras · corredor en tercera',
    descripcion: 'Jack Morris lleva diez entradas en blanco. Una carrera y se acaba la Serie.',
    carreras: { local: 0, rival: 0 },
    outs: 1,
    bases: [false, false, true],
    abre: 1,
  },
  {
    id: '1993',
    year: '1993',
    serie: 'SERIE MUNDIAL 1993 · JUEGO 6',
    local: { escudo: 'blue-jays', nombre: 'BLUE JAYS', abrev: 'TOR', ciudad: 'Toronto' },
    rival: { escudo: 'phillies', nombre: 'PHILLIES', abrev: 'PHI', ciudad: 'Filadelfia', color: '#E81828' },
    situacion: 'Cierre del 9° · abajo por una · dos en base',
    descripcion: 'Toronto pierde 6-5 con dos corredores. Un batazo cierra la Serie en casa.',
    carreras: { local: 5, rival: 6 },
    outs: 1,
    bases: [true, true, false],
    abre: 2,
  },
  {
    id: '1996',
    year: '1996',
    serie: 'SERIE MUNDIAL 1996 · JUEGO 6',
    local: { escudo: 'yankees', nombre: 'YANKEES', abrev: 'NYY', ciudad: 'Nueva York' },
    rival: { escudo: 'braves', nombre: 'BRAVES', abrev: 'ATL', ciudad: 'Atlanta', color: '#13274F' },
    situacion: 'Cierre del 9° · arriba 3-2 · se defiende la ventaja',
    descripcion: 'Nueva York va ganando y busca ampliar. El primer título de la nueva dinastía.',
    carreras: { local: 3, rival: 2 },
    outs: 0,
    bases: [true, false, false],
    abre: 3,
  },
  {
    id: '2001',
    year: '2001',
    serie: 'SERIE MUNDIAL 2001 · JUEGO 7',
    local: { escudo: 'yankees', nombre: 'YANKEES', abrev: 'NYY', ciudad: 'Nueva York' },
    rival: { escudo: 'diamondbacks', nombre: 'D-BACKS', abrev: 'ARI', ciudad: 'Arizona', color: '#A71930' },
    situacion: 'Cierre del 9° · abajo por una · bases llenas',
    descripcion: 'Bases llenas en el séptimo juego contra el mejor cerrador de la historia.',
    carreras: { local: 1, rival: 2 },
    outs: 1,
    bases: [true, true, true],
    abre: 4,
  },
  {
    id: '2016',
    year: '2016',
    serie: 'SERIE MUNDIAL 2016 · JUEGO 7',
    local: { escudo: 'guardians', nombre: 'GUARDIANS', abrev: 'CLE', ciudad: 'Cleveland' },
    rival: { escudo: 'cubs', nombre: 'CUBS', abrev: 'CHC', ciudad: 'Chicago', color: '#0E3386' },
    situacion: 'Entrada extra · empate tras la lluvia',
    descripcion: 'Décima entrada, después de la pausa por lluvia. Dos sequías enormes en juego.',
    carreras: { local: 6, rival: 6 },
    outs: 2,
    bases: [true, false, false],
    abre: 5,
  },
  {
    id: '2023',
    year: '2023',
    serie: 'SERIE MUNDIAL 2023 · JUEGO 5',
    local: { escudo: 'rangers', nombre: 'RANGERS', abrev: 'TEX', ciudad: 'Texas' },
    rival: { escudo: 'diamondbacks', nombre: 'D-BACKS', abrev: 'ARI', ciudad: 'Arizona', color: '#A71930' },
    situacion: 'Cierre del 9° · batazo del título',
    descripcion: 'Texas está a un batazo de su primer campeonato en sesenta y tres temporadas.',
    carreras: { local: 4, rival: 0 },
    outs: 1,
    bases: [false, true, false],
    abre: 6,
  },
]

export function buscarFinal(id) {
  return finals.find((final) => final.id === id) || null
}

// Una final esta abierta cuando ya se juntaron los trofeos que pide
export function finalAbierta(final, trofeosGanados) {
  return trofeosGanados >= final.abre
}
