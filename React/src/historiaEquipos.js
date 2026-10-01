// Historia ampliada de cada club para la pestana HISTORIA de su ficha.
// Datos reales; si algo choca con teamsData.js, manda teamsData.js.
const historias = {
  yankees: {
    parrafos: [
      'Con Ruth y Lou Gehrig, la alineación de 1927 recibió el apodo de Murderers’ Row y ganó 110 juegos. Después llegaron Joe DiMaggio, Yogi Berra y Mickey Mantle, y entre 1936 y 1939 ganaron cuatro Series seguidas.',
      'En los noventa volvió la dinastía con el Core Four: Derek Jeter, Mariano Rivera, Andy Pettitte y Jorge Posada. Ganaron cuatro títulos en cinco años, de 1996 a 2000, y el más reciente llegó en 2009, el primer año del nuevo Yankee Stadium.',
    ],
    momentos: [
      [1923, 'Abre el Yankee Stadium y llega el primer título.'],
      [1927, 'Babe Ruth conecta 60 jonrones.'],
      [1939, 'Lou Gehrig se despide del béisbol en el estadio lleno.'],
      [1956, 'Don Larsen lanza el único juego perfecto de una Serie Mundial.'],
      [2009, 'Título número 27, en el estadio nuevo.'],
    ],
    leyendas: ['BABE RUTH', 'LOU GEHRIG', 'JOE DIMAGGIO', 'MICKEY MANTLE', 'DEREK JETER', 'MARIANO RIVERA'],
  },
  'red-sox': {
    parrafos: [
      'Ted Williams, el último en batear .400 en una temporada, y Carl Yastrzemski, Triple Corona en 1967, sostuvieron al club en los años sin título. En 1975 perdieron una Serie histórica contra Cincinnati y en 1986 otra que tuvieron a un strike de ganar.',
      'La sequía terminó en 2004: abajo 3-0 contra los Yankees en la Serie de Campeonato, ganaron ocho juegos seguidos entre la remontada y la barrida a San Luis. Con David Ortiz como figura volvieron a ganar en 2007 y 2013, y en 2018 sumaron el noveno.',
    ],
    momentos: [
      [1903, 'Ganan la primera Serie Mundial moderna.'],
      [1912, 'Abre Fenway Park.'],
      [1941, 'Ted Williams batea .406.'],
      [1975, 'Carlton Fisk gana el sexto juego con un jonrón en la entrada 12.'],
      [2004, 'La remontada ante los Yankees y el fin de la sequía.'],
    ],
    leyendas: ['CY YOUNG', 'TED WILLIAMS', 'CARL YASTRZEMSKI', 'PEDRO MARTÍNEZ', 'DAVID ORTIZ'],
  },
  'blue-jays': {
    parrafos: [
      'Nacieron con la expansión de 1977 y jugaron en Exhibition Stadium hasta 1989, cuando abrió el SkyDome, el primer estadio con techo retráctil totalmente motorizado. Hoy se llama Rogers Centre.',
      'Los equipos campeones tenían a Roberto Alomar, Joe Carter, Paul Molitor y Dave Winfield. Después vinieron Carlos Delgado, Roy Halladay y, en 2015, el bat flip de José Bautista contra Texas.',
    ],
    momentos: [
      [1977, 'Primer juego de su historia, bajo la nieve.'],
      [1989, 'Abre el SkyDome.'],
      [1992, 'Primer título para un club fuera de Estados Unidos.'],
      [1993, 'Joe Carter cierra la Serie con un jonrón.'],
      [2015, 'El bat flip de Bautista en la Serie Divisional.'],
    ],
    leyendas: ['ROBERTO ALOMAR', 'JOE CARTER', 'ROY HALLADAY', 'CARLOS DELGADO', 'JOSÉ BAUTISTA'],
  },
  rays: {
    parrafos: [
      'Jugaron sus primeras diez temporadas como Devil Rays, casi siempre en último lugar. En 2008 quitaron el Devil del nombre y pasaron del último puesto a ganar el banderín, con Evan Longoria, Carl Crawford y Joe Maddon como mánager.',
      'Son famosos por innovar con poco dinero: defensas desplazadas, el abridor de una sola entrada y un sistema de granjas que no deja de producir. En 2020 llegaron a su segunda Serie Mundial y la perdieron ante los Dodgers.',
    ],
    momentos: [
      [1998, 'Primer juego de la franquicia.'],
      [2008, 'Del último lugar al banderín.'],
      [2010, 'Matt Garza lanza el primer juego sin hit del club.'],
      [2011, 'Longoria los mete a la postemporada con un jonrón en el juego 162.'],
      [2020, 'Segunda Serie Mundial.'],
    ],
    leyendas: ['EVAN LONGORIA', 'CARL CRAWFORD', 'DAVID PRICE', 'BEN ZOBRIST', 'BLAKE SNELL'],
  },
  orioles: {
    parrafos: [
      'Empezaron en 1901 como Brewers de Milwaukee y al año siguiente se fueron a San Luis como Browns, uno de los clubes más débiles de la liga, con un solo banderín, el de 1944. En Baltimore todo cambió: Brooks Robinson, Frank Robinson y Jim Palmer los llevaron a cuatro Series entre 1966 y 1971.',
      'Ganaron en 1966, 1970 y 1983. Camden Yards, abierto en 1992, cambió la forma de construir estadios: ladrillo, un viejo almacén detrás del jardín derecho y vista a la ciudad, una idea que medio béisbol copió después.',
    ],
    momentos: [
      [1954, 'Llegan a Baltimore.'],
      [1966, 'Barren a los Dodgers y ganan su primer título.'],
      [1970, 'Brooks Robinson es el MVP de la Serie con su defensa en tercera.'],
      [1992, 'Abre Camden Yards.'],
      [1995, 'Ripken rompe el récord de juegos seguidos de Lou Gehrig.'],
    ],
    leyendas: ['BROOKS ROBINSON', 'FRANK ROBINSON', 'JIM PALMER', 'EDDIE MURRAY', 'CAL RIPKEN JR.'],
  },
  guardians: {
    parrafos: [
      'En 1947 Larry Doby fue el primer jugador negro de la Liga Americana, once semanas después de Jackie Robinson, y al año siguiente ganaron el título con Bob Feller, Lou Boudreau y Satchel Paige. En 1954 ganaron 111 juegos y perdieron la Serie ante los Gigantes, la de la atrapada de Willie Mays.',
      'En los noventa, con Jim Thome, Manny Ramírez y Albert Belle, llenaron 455 juegos seguidos en su estadio nuevo y llegaron a las Series de 1995 y 1997. La de 2016 la perdieron en el séptimo juego, en entradas extra, contra los Cubs.',
    ],
    momentos: [
      [1920, 'Primer título.'],
      [1947, 'Debuta Larry Doby.'],
      [1948, 'Segundo título, con Feller y Paige.'],
      [1994, 'Abre Jacobs Field, hoy Progressive Field.'],
      [2016, 'Séptimo juego de la Serie, decidido en la décima.'],
    ],
    leyendas: ['BOB FELLER', 'LARRY DOBY', 'LOU BOUDREAU', 'JIM THOME', 'OMAR VIZQUEL'],
  },
  tigers: {
    parrafos: [
      'Ganaron tres banderines seguidos, de 1907 a 1909, con Ty Cobb, que se retiró con el promedio de bateo más alto de la historia. El primer título llegó en 1935 con Hank Greenberg y Charlie Gehringer, y repitieron en 1945.',
      'Volvieron a la Serie en 2006 y 2012. Miguel Cabrera ganó la Triple Corona en 2012, la primera en 45 años; en 2021 llegó a los 500 jonrones y un año después sumó 3,000 hits.',
    ],
    momentos: [
      [1907, 'Primer banderín, con Ty Cobb.'],
      [1935, 'Primer título.'],
      [1968, 'Denny McLain gana 31 juegos y llega el tercer título.'],
      [1984, 'Arrancan 35-5 y ganan la Serie.'],
      [2012, 'Triple Corona de Miguel Cabrera.'],
    ],
    leyendas: ['TY COBB', 'HANK GREENBERG', 'AL KALINE', 'ALAN TRAMMELL', 'MIGUEL CABRERA'],
  },
  royals: {
    parrafos: [
      'Llegaron con la expansión de 1969 y en pocos años ya peleaban: entre 1976 y 1985 jugaron siete postemporadas. George Brett bateó .390 en 1980, el promedio más alto desde Ted Williams, y ese año ganaron su primer banderín.',
      'Tras casi treinta años sin postemporada volvieron en 2014 por el comodín y llegaron al séptimo juego de la Serie. Al año siguiente ganaron el título con Salvador Pérez, Lorenzo Cain y un bullpen que casi no permitía carreras.',
    ],
    momentos: [
      [1973, 'Abre su estadio, hoy Kauffman Stadium.'],
      [1980, 'George Brett batea .390.'],
      [1985, 'Primer título, remontando dos series.'],
      [2014, 'Regresan a la Serie Mundial.'],
      [2015, 'Segundo título.'],
    ],
    leyendas: ['GEORGE BRETT', 'FRANK WHITE', 'BRET SABERHAGEN', 'ALEX GORDON', 'SALVADOR PÉREZ'],
  },
  twins: {
    parrafos: [
      'Como Senadores de Washington ganaron la Serie de 1924 con Walter Johnson, uno de los mejores lanzadores de la historia. En Minnesota llegaron Harmon Killebrew, con 573 jonrones, Tony Oliva y Rod Carew, siete veces campeón de bateo.',
      'Ganaron las Series de 1987 y 1991 sin perder un solo juego en casa, en el ruidoso Metrodome. Kirby Puckett fue la figura de ambas; en 1991 forzó el séptimo juego con un jonrón en la entrada 11 del sexto.',
    ],
    momentos: [
      [1924, 'Título como Senadores de Washington.'],
      [1961, 'Llegan a Minnesota.'],
      [1987, 'Primer título en Minnesota.'],
      [1991, 'Jack Morris lanza diez entradas en blanco en el séptimo juego.'],
      [2010, 'Abre Target Field.'],
    ],
    leyendas: ['WALTER JOHNSON', 'HARMON KILLEBREW', 'ROD CAREW', 'KIRBY PUCKETT', 'JOE MAUER'],
  },
  'white-sox': {
    parrafos: [
      'Ganaron la Serie de 1906 con un equipo apodado los Hitless Wonders por lo poco que bateaba, y la de 1917. En 1919 perdieron la Serie a propósito por dinero de apostadores: ocho jugadores, Shoeless Joe Jackson entre ellos, quedaron fuera del béisbol para siempre.',
      'En 1959 volvieron a la Serie con los Go-Go Sox de Luis Aparicio y Nellie Fox. Frank Thomas ganó dos MVP seguidos en 1993 y 1994, y en 2005 Paul Konerko y Mark Buehrle les dieron el título que esperaban desde 1917.',
    ],
    momentos: [
      [1906, 'Los Hitless Wonders ganan la Serie.'],
      [1919, 'El escándalo de los Black Sox.'],
      [1959, 'Los Go-Go Sox ganan el banderín.'],
      [1991, 'Abre su estadio nuevo, hoy Rate Field.'],
      [2005, 'Título con barrida a Houston.'],
    ],
    leyendas: ['LUIS APARICIO', 'NELLIE FOX', 'FRANK THOMAS', 'PAUL KONERKO', 'MARK BUEHRLE'],
  },
  astros: {
    parrafos: [
      'El Astrodome fue el primer estadio techado del béisbol; el pasto natural no sobrevivió bajo el techo y así llegó el AstroTurf. En la Liga Nacional tuvieron a Nolan Ryan y a los Killer B’s, Jeff Bagwell y Craig Biggio, y en 2005 llegaron a su primera Serie Mundial.',
      'En la Liga Americana se volvieron potencia con José Altuve, Carlos Correa, Alex Bregman y Justin Verlander. Ganaron en 2017 y 2022, aunque el primer título quedó marcado por el robo de señas con cámaras, que la liga sancionó en 2020.',
    ],
    momentos: [
      [1965, 'Abre el Astrodome.'],
      [2005, 'Primera Serie Mundial.'],
      [2013, 'Pasan a la Liga Americana.'],
      [2017, 'Primer título.'],
      [2022, 'Segundo título.'],
    ],
    leyendas: ['NOLAN RYAN', 'CRAIG BIGGIO', 'JEFF BAGWELL', 'JOSÉ ALTUVE', 'JUSTIN VERLANDER'],
  },
  angels: {
    parrafos: [
      'Nacieron con la expansión de 1961 en Los Ángeles y se mudaron a Anaheim en 1966. Nolan Ryan lanzó ahí cuatro de sus siete juegos sin hit y en 1973 ponchó a 383 bateadores, récord de la era moderna.',
      'Rod Carew, Reggie Jackson y Vladimir Guerrero pasaron por el club. Mike Trout ganó tres MVP y Shohei Ohtani dos, en 2021 y 2023, lanzando y bateando como nadie desde Babe Ruth.',
    ],
    momentos: [
      [1961, 'Primer juego de la franquicia.'],
      [1966, 'Estrenan estadio en Anaheim.'],
      [1973, 'Nolan Ryan poncha a 383.'],
      [2002, 'Título remontando en el sexto juego.'],
      [2021, 'Primer MVP de Shohei Ohtani.'],
    ],
    leyendas: ['NOLAN RYAN', 'ROD CAREW', 'VLADIMIR GUERRERO', 'MIKE TROUT', 'SHOHEI OHTANI'],
  },
  athletics: {
    parrafos: [
      'Connie Mack los dirigió cincuenta temporadas, de 1901 a 1950, y armó dos dinastías en Filadelfia: la de 1910 a 1914 y la de Jimmie Foxx y Lefty Grove a principios de los treinta.',
      'En Oakland ganaron tres Series seguidas entre 1972 y 1974 con Reggie Jackson, Catfish Hunter y Rollie Fingers, y otra en 1989 con los Bash Brothers, Mark McGwire y José Canseco. En 2002, con la nómina más baja, ganaron 20 juegos seguidos.',
    ],
    momentos: [
      [1910, 'Primer título, en Filadelfia.'],
      [1968, 'Llegan a Oakland.'],
      [1972, 'Primero de tres títulos seguidos.'],
      [1989, 'Ganan la Serie del terremoto ante San Francisco.'],
      [2002, 'Veinte victorias seguidas: la historia de Moneyball.'],
    ],
    leyendas: ['CONNIE MACK', 'JIMMIE FOXX', 'REGGIE JACKSON', 'RICKEY HENDERSON', 'DENNIS ECKERSLEY'],
  },
  mariners: {
    parrafos: [
      'Nacieron en 1977 en el Kingdome. Su primera postemporada llegó en 1995: Edgar Martínez conectó un doble en la entrada 11 del quinto juego contra los Yankees, una jugada que ayudó a salvar al béisbol en Seattle.',
      'Ken Griffey Jr. llegó a los 19 años y se volvió el jugador más popular de los noventa. En 2001 debutó Ichiro Suzuki, novato del año y MVP en la misma temporada, y en 2004 conectó 262 hits, récord de todos los tiempos.',
    ],
    momentos: [
      [1977, 'Primer juego, en el Kingdome.'],
      [1995, 'El doble de Edgar Martínez.'],
      [1999, 'Abre su estadio, hoy T-Mobile Park.'],
      [2001, 'Ganan 116 juegos.'],
      [2004, 'Ichiro conecta 262 hits.'],
    ],
    leyendas: ['KEN GRIFFEY JR.', 'EDGAR MARTÍNEZ', 'RANDY JOHNSON', 'ICHIRO SUZUKI', 'FÉLIX HERNÁNDEZ'],
  },
  rangers: {
    parrafos: [
      'Empezaron en 1961 como los nuevos Senadores de Washington y llegaron a Texas en 1972. Nolan Ryan lanzó ahí sus dos últimos juegos sin hit y su ponche 5,000.',
      'En los noventa tuvieron a Iván Rodríguez, Juan González y Rafael Palmeiro, y ganaron su división tres veces. En 2020 estrenaron Globe Life Field, con techo retráctil, y tres años después Corey Seager y Adolis García les dieron el título.',
    ],
    momentos: [
      [1972, 'Llegan a Texas.'],
      [1989, 'Nolan Ryan llega a 5,000 ponches.'],
      [2010, 'Primera Serie Mundial.'],
      [2011, 'A un strike del título en el sexto juego.'],
      [2023, 'Primer título.'],
    ],
    leyendas: ['NOLAN RYAN', 'IVÁN RODRÍGUEZ', 'JUAN GONZÁLEZ', 'MICHAEL YOUNG', 'ADRIÁN BELTRÉ'],
  },
}

export function historiaDe(equipoId) {
  return historias[equipoId] || { parrafos: [], momentos: [], leyendas: [] }
}
