// Tres epocas por equipo, cinco preguntas cada una: 225 en total. Lo que se
// pregunta sale de teamsData.js y de la historia real del equipo: si un dato
// cambia alla, hay que cambiarlo aqui tambien.
export const triviaPorEquipo = {
  yankees: [
    {
      id: 'murderers-row',
      nombre: 'MURDERERS’ ROW',
      anios: '1920-1939',
      preguntas: [
        { pregunta: '¿De qué equipo llegó Babe Ruth a Nueva York en 1920?', opciones: ['Red Sox', 'Orioles', 'Tigers', 'White Sox'], correcta: 0, nota: 'Boston lo vendió y ahí arrancó la dinastía neoyorquina.' },
        { pregunta: '¿Cuántos jonrones pegó Babe Ruth en 1927?', opciones: ['52', '54', '59', '60'], correcta: 3, nota: 'Rompió su propio récord y la marca duró 34 años.' },
        { pregunta: '¿Cuántos juegos ganaron los Yankees de 1927?', opciones: ['104', '107', '110', '114'], correcta: 2, nota: '110 y 44: récord de la Liga Americana hasta 1954.' },
        { pregunta: '¿En qué año ganaron su primera Serie Mundial?', opciones: ['1903', '1912', '1918', '1923'], correcta: 3, nota: 'El mismo año que abrió el Yankee Stadium.' },
        { pregunta: '¿Cuántos juegos seguidos jugó Lou Gehrig antes de parar en 1939?', opciones: ['1,207', '1,890', '2,130', '2,632'], correcta: 2, nota: 'La racha terminó por la enfermedad que hoy lleva su nombre.' },
      ],
    },
    {
      id: 'dinastia-mantle',
      nombre: 'LA DINASTÍA DE MANTLE',
      anios: '1947-1964',
      preguntas: [
        { pregunta: '¿Cuántas Series Mundiales seguidas ganaron entre 1949 y 1953?', opciones: ['Tres', 'Cuatro', 'Cinco', 'Seis'], correcta: 2, nota: 'Una racha que nadie ha repetido.' },
        { pregunta: '¿De cuántos juegos fue la racha de hits de Joe DiMaggio en 1941?', opciones: ['44', '50', '56', '61'], correcta: 2, nota: 'Sigue siendo el récord de Grandes Ligas.' },
        { pregunta: '¿Qué logró Mickey Mantle en 1956?', opciones: ['La Triple Corona', '60 jonrones', '200 carreras', 'Un juego perfecto'], correcta: 0, nota: 'Lideró en promedio, jonrones y carreras producidas.' },
        { pregunta: '¿Quién lanzó el único juego perfecto de una Serie Mundial, en 1956?', opciones: ['Whitey Ford', 'Don Larsen', 'Allie Reynolds', 'Bob Turley'], correcta: 1, nota: 'Fue contra los Dodgers, en el quinto juego.' },
        { pregunta: '¿Cuántos jonrones pegó Roger Maris en 1961?', opciones: ['59', '60', '61', '62'], correcta: 2, nota: 'Superó por uno la marca de Babe Ruth.' },
      ],
    },
    {
      id: 'core-four',
      nombre: 'LOS CORE FOUR',
      anios: '1996-2009',
      preguntas: [
        { pregunta: '¿Cuántas Series Mundiales ganaron entre 1996 y 2000?', opciones: ['Dos', 'Tres', 'Cuatro', 'Cinco'], correcta: 2, nota: '1996, 1998, 1999 y 2000.' },
        { pregunta: '¿Cuántos juegos ganó el equipo de 1998 en temporada regular?', opciones: ['108', '110', '114', '116'], correcta: 2, nota: 'Récord de la Liga Americana en ese momento.' },
        { pregunta: '¿Con qué batazo llegó Derek Jeter a sus 3,000 hits en 2011?', opciones: ['Sencillo', 'Doble', 'Triple', 'Jonrón'], correcta: 3, nota: 'Se lo conectó a David Price el 9 de julio.' },
        { pregunta: '¿Cuántos salvamentos tiene Mariano Rivera, récord de Grandes Ligas?', opciones: ['601', '652', '675', '700'], correcta: 1, nota: 'Se retiró en 2013 con esa marca.' },
        { pregunta: '¿Contra quién ganaron la Serie Mundial de 2009?', opciones: ['Phillies', 'Mets', 'Red Sox', 'Dodgers'], correcta: 0, nota: 'El primer título en el Yankee Stadium nuevo.' },
      ],
    },
  ],
  'red-sox': [
    {
      id: 'maldicion',
      nombre: 'LA MALDICIÓN DEL BAMBINO',
      anios: '1918-1974',
      preguntas: [
        { pregunta: '¿En qué año ganaron su primera Serie Mundial?', opciones: ['1903', '1912', '1918', '1920'], correcta: 0, nota: 'Fue la primera Serie Mundial moderna.' },
        { pregunta: '¿A quién vendieron en 1920 y con eso empezó la maldición?', opciones: ['Cy Young', 'Babe Ruth', 'Tris Speaker', 'Jimmie Foxx'], correcta: 1, nota: 'Lo vendieron a los Yankees y pasaron 86 años sin título.' },
        { pregunta: '¿En qué año abrió Fenway Park?', opciones: ['1901', '1912', '1918', '1934'], correcta: 1, nota: 'Es el parque más antiguo que sigue en uso.' },
        { pregunta: '¿Quién fue el último en batear .400 en una temporada, en 1941?', opciones: ['Ted Williams', 'Joe DiMaggio', 'Carl Yastrzemski', 'Jimmie Foxx'], correcta: 0, nota: 'Terminó con .406 y nadie lo ha repetido.' },
        { pregunta: '¿Cómo le dicen a la pared izquierda de Fenway Park?', opciones: ['El Muro Azul', 'El Monstruo Verde', 'La Bahía', 'El Cañón'], correcta: 1, nota: 'Mide más de 11 metros de alto.' },
      ],
    },
    {
      id: 'espera',
      nombre: 'LA ESPERA LARGA',
      anios: '1975-2003',
      preguntas: [
        { pregunta: '¿Contra quién perdieron la Serie Mundial de 1975 en siete juegos?', opciones: ['Reds', 'Mets', 'Dodgers', 'Cardinals'], correcta: 0, nota: 'Cincinnati ganó con la Maquinaria Roja.' },
        { pregunta: '¿Quién pegó el jonrón del juego 6 de 1975 empujando la bola con las manos?', opciones: ['Carl Yastrzemski', 'Carlton Fisk', 'Jim Rice', 'Fred Lynn'], correcta: 1, nota: 'Una de las imágenes más repetidas del béisbol.' },
        { pregunta: '¿Contra quién perdieron la Serie Mundial de 1986?', opciones: ['Mets', 'Yankees', 'Angels', 'Astros'], correcta: 0, nota: 'Estuvieron a un out de ganar el sexto juego.' },
        { pregunta: '¿Cuántos ponches tuvo Roger Clemens en un juego de 1986?', opciones: ['17', '18', '19', '20'], correcta: 3, nota: 'Fue récord de Grandes Ligas para un juego de nueve entradas.' },
        { pregunta: '¿Quién ganó el Cy Young en 1999 y 2000 con Boston?', opciones: ['Roger Clemens', 'Pedro Martínez', 'Curt Schilling', 'Derek Lowe'], correcta: 1, nota: 'Su temporada de 2000 es de las mejores que se han lanzado.' },
      ],
    },
    {
      id: 'fin-maldicion',
      nombre: 'EL FIN DE LA MALDICIÓN',
      anios: '2004-2018',
      preguntas: [
        { pregunta: '¿Con qué desventaja remontaron a los Yankees en 2004?', opciones: ['0-2', '0-3', '1-3', '2-3'], correcta: 1, nota: 'Nadie más lo ha hecho en una serie al mejor de siete.' },
        { pregunta: '¿Cuántos años pasaron entre 1918 y el título de 2004?', opciones: ['76', '80', '86', '90'], correcta: 2, nota: 'La sequía más famosa del béisbol.' },
        { pregunta: '¿A quién barrieron en la Serie Mundial de 2004?', opciones: ['Cardinals', 'Astros', 'Rockies', 'Dodgers'], correcta: 0, nota: 'Ganaron los cuatro juegos seguidos.' },
        { pregunta: '¿Cuántas Series Mundiales ganaron entre 2004 y 2018?', opciones: ['Dos', 'Tres', 'Cuatro', 'Cinco'], correcta: 2, nota: '2004, 2007, 2013 y 2018.' },
        { pregunta: '¿Quién fue el Jugador Más Valioso de la Serie Mundial de 2013?', opciones: ['Dustin Pedroia', 'David Ortiz', 'Jon Lester', 'Shane Victorino'], correcta: 1, nota: 'Bateó .688 en esa serie.' },
      ],
    },
  ],
  'blue-jays': [
    {
      id: 'primeros-anios',
      nombre: 'LOS PRIMEROS AÑOS',
      anios: '1977-1990',
      preguntas: [
        { pregunta: '¿En qué año jugaron su primera temporada?', opciones: ['1969', '1977', '1980', '1985'], correcta: 1, nota: 'Entraron a la liga junto con los Mariners.' },
        { pregunta: '¿En qué estadio jugaban antes del SkyDome?', opciones: ['Exhibition Stadium', 'Maple Leaf Gardens', 'Olympic Stadium', 'Rogers Centre'], correcta: 0, nota: 'Un estadio al aire libre, con inviernos durísimos.' },
        { pregunta: '¿En qué año abrió el SkyDome?', opciones: ['1985', '1989', '1992', '1995'], correcta: 1, nota: 'Fue el primer estadio con techo retráctil que funcionó de verdad.' },
        { pregunta: '¿Cómo se llama hoy ese estadio?', opciones: ['Rogers Centre', 'Tropicana Field', 'Comerica Park', 'Target Field'], correcta: 0, nota: 'Cambió de nombre en 2005.' },
        { pregunta: '¿En qué año ganaron su primer título de división?', opciones: ['1983', '1985', '1987', '1989'], correcta: 1, nota: 'Perdieron la Serie de Campeonato contra Kansas City.' },
      ],
    },
    {
      id: 'dos-titulos',
      nombre: 'LOS DOS TÍTULOS',
      anios: '1991-1993',
      preguntas: [
        { pregunta: '¿En qué año ganaron su primera Serie Mundial?', opciones: ['1985', '1989', '1992', '1993'], correcta: 2, nota: 'El primer título para un equipo fuera de Estados Unidos.' },
        { pregunta: '¿Contra quién ganaron la Serie Mundial de 1992?', opciones: ['Bravos', 'Phillies', 'Twins', 'Reds'], correcta: 0, nota: 'Ganaron en seis juegos.' },
        { pregunta: '¿Quién cerró la Serie Mundial de 1993 con un jonrón?', opciones: ['Roberto Alomar', 'Joe Carter', 'Paul Molitor', 'John Olerud'], correcta: 1, nota: 'Es uno de los dos jonrones que han terminado una Serie Mundial.' },
        { pregunta: '¿Contra qué equipo fue ese jonrón?', opciones: ['Phillies', 'Bravos', 'Cardinals', 'Giants'], correcta: 0, nota: 'Se lo pegó a Mitch Williams.' },
        { pregunta: '¿Qué hace únicos a los Blue Jays entre los campeones?', opciones: ['Nunca han perdido una Serie', 'Son el único club fuera de Estados Unidos', 'Nunca han cambiado de estadio', 'Ganaron sin lanzadores extranjeros'], correcta: 1, nota: 'Y lo lograron dos años seguidos.' },
      ],
    },
    {
      id: 'era-moderna',
      nombre: 'LA ERA MODERNA',
      anios: '2015-hoy',
      preguntas: [
        { pregunta: '¿Quién pegó el jonrón de 2015 que terminó con el bate volando?', opciones: ['Edwin Encarnación', 'José Bautista', 'Josh Donaldson', 'Troy Tulowitzki'], correcta: 1, nota: 'Fue en el séptimo juego de la serie divisional.' },
        { pregunta: '¿Contra qué equipo fue esa serie?', opciones: ['Rangers', 'Royals', 'Orioles', 'Yankees'], correcta: 0, nota: 'Texas iba ganando la serie 2-0.' },
        { pregunta: '¿Quién ganó el premio al Jugador Más Valioso en 2015 con Toronto?', opciones: ['José Bautista', 'Josh Donaldson', 'Edwin Encarnación', 'Russell Martin'], correcta: 1, nota: 'Produjo 123 carreras esa temporada.' },
        { pregunta: '¿Quién es el líder histórico de jonrones de la franquicia?', opciones: ['Carlos Delgado', 'José Bautista', 'Vernon Wells', 'Joe Carter'], correcta: 0, nota: 'Pegó 336 con Toronto.' },
        { pregunta: '¿De qué estrella es hijo Vladimir Guerrero Jr.?', opciones: ['Un campocorto dominicano', 'Un jardinero del Salón de la Fama', 'Un lanzador cubano', 'Un cátcher venezolano'], correcta: 1, nota: 'Su papá entró al Salón de la Fama en 2018.' },
      ],
    },
  ],
  rays: [
    {
      id: 'devil-rays',
      nombre: 'LOS DEVIL RAYS',
      anios: '1998-2007',
      preguntas: [
        { pregunta: '¿En qué año jugaron su primera temporada?', opciones: ['1993', '1998', '2001', '2005'], correcta: 1, nota: 'Entraron junto con los Diamondbacks.' },
        { pregunta: '¿Cómo se llamaban antes de 2008?', opciones: ['Devil Rays', 'Sun Rays', 'Suncoast Rays', 'Bay Rays'], correcta: 0, nota: 'Le quitaron el "Devil" al cambiar de imagen.' },
        { pregunta: '¿Cómo se llama su estadio?', opciones: ['Tropicana Field', 'Marlins Park', 'Camden Yards', 'Kauffman Stadium'], correcta: 0, nota: 'Es techado y tiene el techo más bajo de la liga.' },
        { pregunta: '¿En qué ciudad juegan?', opciones: ['Tampa', 'St. Petersburg', 'Miami', 'Orlando'], correcta: 1, nota: 'Están del otro lado de la bahía de Tampa.' },
        { pregunta: '¿Quién fue su primer gran robador de bases?', opciones: ['Carl Crawford', 'Rocco Baldelli', 'Aubrey Huff', 'Fred McGriff'], correcta: 0, nota: 'Lideró la Liga Americana en robos cuatro veces.' },
      ],
    },
    {
      id: 'salto-2008',
      nombre: 'EL SALTO DE 2008',
      anios: '2008-2013',
      preguntas: [
        { pregunta: '¿En qué año llegaron por primera vez a la Serie Mundial?', opciones: ['2005', '2008', '2010', '2013'], correcta: 1, nota: 'Venían de terminar últimos casi todos los años.' },
        { pregunta: '¿Contra quién perdieron esa Serie Mundial?', opciones: ['Phillies', 'Red Sox', 'Yankees', 'Giants'], correcta: 0, nota: 'Perdieron en cinco juegos.' },
        { pregunta: '¿Quién ganó el Novato del Año en 2008 con Tampa Bay?', opciones: ['Evan Longoria', 'David Price', 'Matt Garza', 'B.J. Upton'], correcta: 0, nota: 'Debutó en abril y acabó siendo la cara del equipo.' },
        { pregunta: '¿Qué le quitaron al nombre en 2008?', opciones: ['Bay', 'Devil', 'Tampa', 'Sun'], correcta: 1, nota: 'Ese mismo año llegaron a la Serie Mundial.' },
        { pregunta: '¿Quién ganó el Cy Young en 2012 con los Rays?', opciones: ['James Shields', 'David Price', 'Matt Moore', 'Chris Archer'], correcta: 1, nota: 'Ganó 20 juegos esa temporada.' },
      ],
    },
    {
      id: 'rays-hoy',
      nombre: 'LOS RAYS DE HOY',
      anios: '2019-hoy',
      preguntas: [
        { pregunta: '¿En qué año volvieron a la Serie Mundial?', opciones: ['2019', '2020', '2021', '2023'], correcta: 1, nota: 'Fue la temporada corta por la pandemia.' },
        { pregunta: '¿Contra quién perdieron la Serie Mundial de 2020?', opciones: ['Dodgers', 'Bravos', 'Astros', 'Nationals'], correcta: 0, nota: 'Perdieron en seis juegos.' },
        { pregunta: '¿Cuántas Series Mundiales han ganado?', opciones: ['Ninguna', 'Una', 'Dos', 'Tres'], correcta: 0, nota: 'Han llegado dos veces y perdido las dos.' },
        { pregunta: '¿Con cuántas victorias seguidas arrancaron la temporada de 2023?', opciones: ['9', '11', '13', '15'], correcta: 2, nota: 'Igualaron el mejor arranque de la era moderna.' },
        { pregunta: '¿Quién es el líder histórico de jonrones de la franquicia?', opciones: ['Evan Longoria', 'Carl Crawford', 'Carlos Peña', 'Ben Zobrist'], correcta: 0, nota: 'Jugó diez temporadas en Tampa Bay.' },
      ],
    },
  ],
  orioles: [
    {
      id: 'robinsons',
      nombre: 'LOS HERMANOS ROBINSON',
      anios: '1966-1971',
      preguntas: [
        { pregunta: '¿En qué año ganaron su primera Serie Mundial?', opciones: ['1954', '1966', '1970', '1983'], correcta: 1, nota: 'Barrieron a los Dodgers en cuatro juegos.' },
        { pregunta: '¿Quién ganó la Triple Corona de bateo en 1966?', opciones: ['Frank Robinson', 'Brooks Robinson', 'Boog Powell', 'Eddie Murray'], correcta: 0, nota: 'Ese mismo año fue el Jugador Más Valioso.' },
        { pregunta: '¿Por qué es famoso Brooks Robinson?', opciones: ['Por su defensa en tercera base', 'Por sus jonrones', 'Por sus robos', 'Por su pitcheo'], correcta: 0, nota: 'Ganó 16 Guantes de Oro seguidos.' },
        { pregunta: '¿Cuántas Series Mundiales tienen los Orioles?', opciones: ['Dos', 'Tres', 'Cuatro', 'Cinco'], correcta: 1, nota: '1966, 1970 y 1983.' },
        { pregunta: '¿Cuántos lanzadores de ese equipo ganaron 20 juegos en 1971?', opciones: ['Dos', 'Tres', 'Cuatro', 'Cinco'], correcta: 2, nota: 'Solo dos equipos en la historia lo han hecho.' },
      ],
    },
    {
      id: 'ripken',
      nombre: 'CAL RIPKEN JR.',
      anios: '1982-2001',
      preguntas: [
        { pregunta: '¿Cuántos juegos seguidos jugó Cal Ripken Jr.?', opciones: ['1,307', '2,130', '2,632', '3,001'], correcta: 2, nota: 'Jugó todos los juegos de su equipo por más de 16 años.' },
        { pregunta: '¿En qué año rompió el récord de Lou Gehrig?', opciones: ['1991', '1993', '1995', '1998'], correcta: 2, nota: 'El juego 2,131 se jugó en Camden Yards.' },
        { pregunta: '¿En qué año ganaron su último título?', opciones: ['1970', '1979', '1983', '1996'], correcta: 2, nota: 'Le ganaron a los Phillies en cinco juegos.' },
        { pregunta: '¿Qué premio ganó Ripken en 1982?', opciones: ['Novato del Año', 'Guante de Oro', 'Cy Young', 'Bate de Plata'], correcta: 0, nota: 'Al año siguiente fue el Jugador Más Valioso.' },
        { pregunta: '¿Cuántas veces fue Jugador Más Valioso Cal Ripken Jr.?', opciones: ['Una', 'Dos', 'Tres', 'Cuatro'], correcta: 1, nota: 'En 1983 y en 1991.' },
      ],
    },
    {
      id: 'camden',
      nombre: 'CAMDEN YARDS Y EL REGRESO',
      anios: '1992-hoy',
      preguntas: [
        { pregunta: '¿En qué año abrió Oriole Park at Camden Yards?', opciones: ['1989', '1992', '1995', '2000'], correcta: 1, nota: 'Cambió la forma en que se construyen los estadios.' },
        { pregunta: '¿Qué empezó Camden Yards?', opciones: ['Los techos retráctiles', 'Los estadios retro', 'El césped artificial', 'Los domos'], correcta: 1, nota: 'Casi todos los estadios nuevos lo copiaron.' },
        { pregunta: '¿Cómo se llama el estadio de los Orioles?', opciones: ['Oriole Park', 'Camden Station', 'Baltimore Field', 'Harbor Park'], correcta: 0, nota: 'Está junto a un almacén de ladrillo de 1898.' },
        { pregunta: '¿Quién ganó el Novato del Año de la Liga Americana en 2023?', opciones: ['Adley Rutschman', 'Gunnar Henderson', 'Jordan Westburg', 'Colton Cowser'], correcta: 1, nota: 'Ganó por unanimidad.' },
        { pregunta: '¿Cuántos juegos ganaron en 2023, el mejor récord de la Liga Americana?', opciones: ['95', '98', '101', '104'], correcta: 2, nota: 'Venían de perder más de 100 juegos dos años antes.' },
      ],
    },
  ],
  guardians: [
    {
      id: 'feller',
      nombre: 'LOS AÑOS DE FELLER',
      anios: '1940-1954',
      preguntas: [
        { pregunta: '¿En qué año ganaron su último título?', opciones: ['1920', '1948', '1954', '1995'], correcta: 1, nota: 'Desde entonces no han vuelto a ganar.' },
        { pregunta: '¿Cuántas Series Mundiales tienen?', opciones: ['Una', 'Dos', 'Tres', 'Cuatro'], correcta: 1, nota: '1920 y 1948.' },
        { pregunta: '¿Cuántos juegos ganaron en 1954, récord de entonces?', opciones: ['106', '108', '111', '116'], correcta: 2, nota: 'Rompieron el récord de los Yankees de 1927.' },
        { pregunta: '¿Cuántos juegos sin hit lanzó Bob Feller?', opciones: ['Uno', 'Dos', 'Tres', 'Cuatro'], correcta: 2, nota: 'Uno de ellos fue en el día inaugural de 1940.' },
        { pregunta: '¿Quién fue el primer jugador negro de la Liga Americana, en 1947?', opciones: ['Larry Doby', 'Satchel Paige', 'Luke Easter', 'Minnie Miñoso'], correcta: 0, nota: 'Debutó once semanas después de Jackie Robinson.' },
      ],
    },
    {
      id: 'noventas',
      nombre: 'EL REGRESO DE LOS NOVENTA',
      anios: '1994-1999',
      preguntas: [
        { pregunta: '¿En qué año abrió el estadio que hoy es Progressive Field?', opciones: ['1992', '1994', '1997', '2000'], correcta: 1, nota: 'Se llamaba Jacobs Field.' },
        { pregunta: '¿En qué años llegaron a la Serie Mundial en esa década?', opciones: ['1993 y 1996', '1995 y 1997', '1996 y 1998', '1997 y 1999'], correcta: 1, nota: 'Perdieron las dos.' },
        { pregunta: '¿Contra quién perdieron la Serie Mundial de 1997 en siete juegos?', opciones: ['Marlins', 'Bravos', 'Yankees', 'Padres'], correcta: 0, nota: 'Perdieron en la undécima entrada del último juego.' },
        { pregunta: '¿Quién es el líder histórico de jonrones de la franquicia?', opciones: ['Jim Thome', 'Albert Belle', 'Manny Ramírez', 'Earl Averill'], correcta: 0, nota: 'Pegó 337 con Cleveland.' },
        { pregunta: '¿Quién pegó 50 jonrones y 52 dobles en 1995?', opciones: ['Albert Belle', 'Manny Ramírez', 'Jim Thome', 'Kenny Lofton'], correcta: 0, nota: 'Nadie más ha llegado a 50 y 50 en una temporada.' },
      ],
    },
    {
      id: 'guardianes',
      nombre: 'DE INDIOS A GUARDIANES',
      anios: '2016-hoy',
      preguntas: [
        { pregunta: '¿En qué temporada estrenaron el nombre Guardians?', opciones: ['2020', '2021', '2022', '2023'], correcta: 2, nota: 'El cambio se anunció en 2021.' },
        { pregunta: '¿Cuántos juegos seguidos ganaron en 2017?', opciones: ['15', '18', '22', '26'], correcta: 2, nota: 'Récord de la Liga Americana.' },
        { pregunta: '¿Contra quién perdieron la Serie Mundial de 2016 en siete juegos?', opciones: ['Cubs', 'Dodgers', 'Astros', 'Red Sox'], correcta: 0, nota: 'Chicago rompió ahí su sequía de 108 años.' },
        { pregunta: '¿Cómo se llama su estadio hoy?', opciones: ['Progressive Field', 'Jacobs Field', 'Municipal Stadium', 'Guardians Park'], correcta: 0, nota: 'Es el mismo de 1994, con otro nombre.' },
        { pregunta: '¿Quién ganó el Cy Young en 2020 con Cleveland?', opciones: ['Corey Kluber', 'Shane Bieber', 'Carlos Carrasco', 'Mike Clevinger'], correcta: 1, nota: 'Ganó la Triple Corona de pitcheo esa temporada.' },
      ],
    },
  ],
  tigers: [
    {
      id: 'cobb',
      nombre: 'TY COBB',
      anios: '1905-1926',
      preguntas: [
        { pregunta: '¿Quién tiene el promedio de bateo más alto de la historia y jugó en Detroit?', opciones: ['Ty Cobb', 'Harry Heilmann', 'Sam Crawford', 'Hank Greenberg'], correcta: 0, nota: 'Terminó con .366 de por vida.' },
        { pregunta: '¿En qué año llegaron a su primera Serie Mundial?', opciones: ['1901', '1907', '1912', '1920'], correcta: 1, nota: 'La perdieron contra los Cubs.' },
        { pregunta: '¿Cuántas Series Mundiales seguidas perdieron desde 1907?', opciones: ['Dos', 'Tres', 'Cuatro', 'Cinco'], correcta: 1, nota: '1907, 1908 y 1909.' },
        { pregunta: '¿Cómo se llamaba entonces su estadio?', opciones: ['Navin Field', 'Comerica Park', 'Briggs Field', 'Motor Park'], correcta: 0, nota: 'Después se llamó Tiger Stadium.' },
        { pregunta: '¿Qué apodo tenía Ty Cobb?', opciones: ['El Bambino', 'El Melocotón de Georgia', 'El Tigre', 'El Martillo'], correcta: 1, nota: 'Nació en Narrows, Georgia.' },
      ],
    },
    {
      id: 'kaline-68',
      nombre: 'KALINE Y EL 68',
      anios: '1953-1972',
      preguntas: [
        { pregunta: '¿A qué edad ganó Al Kaline el título de bateo, el más joven de la historia?', opciones: ['19', '20', '21', '22'], correcta: 1, nota: 'Fue en 1955, con .340.' },
        { pregunta: '¿En qué año ganaron la Serie Mundial remontando 3-1?', opciones: ['1945', '1968', '1972', '1984'], correcta: 1, nota: 'Le dio un respiro a una ciudad muy golpeada.' },
        { pregunta: '¿Contra quién ganaron esa Serie Mundial?', opciones: ['Cardinals', 'Reds', 'Mets', 'Dodgers'], correcta: 0, nota: 'Le remontaron a Bob Gibson.' },
        { pregunta: '¿Quién ganó 31 juegos en 1968?', opciones: ['Mickey Lolich', 'Denny McLain', 'Jim Bunning', 'Earl Wilson'], correcta: 1, nota: 'Nadie ha vuelto a ganar 30 en una temporada.' },
        { pregunta: '¿Cuántos jonrones pegó Al Kaline en su carrera?', opciones: ['349', '369', '399', '429'], correcta: 2, nota: 'Nunca quiso una temporada de 30 para no presionarse.' },
      ],
    },
    {
      id: 'verlander-cabrera',
      nombre: 'VERLANDER Y CABRERA',
      anios: '2006-2014',
      preguntas: [
        { pregunta: '¿Quién ganó la Triple Corona en 2012, la primera en 45 años?', opciones: ['Miguel Cabrera', 'Prince Fielder', 'Víctor Martínez', 'Magglio Ordóñez'], correcta: 0, nota: 'La anterior había sido de Carl Yastrzemski en 1967.' },
        { pregunta: '¿En qué años llegaron a la Serie Mundial en esa época?', opciones: ['2006 y 2012', '2007 y 2011', '2009 y 2013', '2011 y 2014'], correcta: 0, nota: 'Perdieron las dos.' },
        { pregunta: '¿Cuántos juegos sin hit lanzó Justin Verlander con Detroit?', opciones: ['Uno', 'Dos', 'Tres', 'Cuatro'], correcta: 1, nota: 'En 2007 y en 2011.' },
        { pregunta: '¿Qué premios ganó Verlander en 2011?', opciones: ['Solo el Cy Young', 'Cy Young y Jugador Más Valioso', 'Solo el MVP', 'Novato y Cy Young'], correcta: 1, nota: 'Ganó 24 juegos esa temporada.' },
        { pregunta: '¿Cómo se llama el estadio de los Tigers?', opciones: ['Comerica Park', 'Tiger Stadium', 'Ford Field', 'Motor City Park'], correcta: 0, nota: 'Abrió en el año 2000.' },
      ],
    },
  ],
  royals: [
    {
      id: 'brett',
      nombre: 'LOS AÑOS DE BRETT',
      anios: '1976-1985',
      preguntas: [
        { pregunta: '¿En qué año ganaron su primera Serie Mundial?', opciones: ['1976', '1980', '1985', '1989'], correcta: 2, nota: 'Remontaron 3-1 en la serie.' },
        { pregunta: '¿Contra quién ganaron la Serie Mundial de 1985?', opciones: ['Cardinals', 'Blue Jays', 'Yankees', 'Dodgers'], correcta: 0, nota: 'Le dicen la Serie de la Interestatal 70.' },
        { pregunta: '¿Cuánto bateó George Brett en 1980?', opciones: ['.360', '.376', '.390', '.406'], correcta: 2, nota: 'Estuvo cerca de ser el primer .400 desde 1941.' },
        { pregunta: '¿Por qué es famoso el juego del pino de 1983?', opciones: ['Le anularon un jonrón a Brett', 'Se suspendió por lluvia', 'Hubo un juego perfecto', 'Se cayó una barda'], correcta: 0, nota: 'Le anularon el jonrón por exceso de pino en el bate y luego se lo devolvieron.' },
        { pregunta: '¿En qué año nacieron los Royals?', opciones: ['1961', '1969', '1972', '1977'], correcta: 1, nota: 'Llegaron cuando los Athletics se fueron a Oakland.' },
      ],
    },
    {
      id: 'sequia',
      nombre: 'LA SEQUÍA',
      anios: '1986-2013',
      preguntas: [
        { pregunta: '¿Cuántos años pasaron sin playoffs después de 1985?', opciones: ['21', '25', '29', '33'], correcta: 2, nota: 'Volvieron hasta 2014.' },
        { pregunta: '¿Quién ganó el Cy Young en 1989 con Kansas City?', opciones: ['Bret Saberhagen', 'Mark Gubicza', 'Kevin Appier', 'Dan Quisenberry'], correcta: 0, nota: 'Ya lo había ganado en 1985.' },
        { pregunta: '¿Cómo se llama su estadio?', opciones: ['Kauffman Stadium', 'Royals Park', 'Truman Field', 'Municipal Stadium'], correcta: 0, nota: 'Es famoso por sus fuentes del jardín.' },
        { pregunta: '¿Qué jugador de los Royals también fue estrella de futbol americano?', opciones: ['Bo Jackson', 'Danny Tartabull', 'Willie Wilson', 'Kevin Seitzer'], correcta: 0, nota: 'Jugó con los Raiders al mismo tiempo.' },
        { pregunta: '¿En qué año se retiró George Brett?', opciones: ['1990', '1993', '1995', '1997'], correcta: 1, nota: 'Jugó sus 21 temporadas con el mismo equipo.' },
      ],
    },
    {
      id: 'regreso',
      nombre: 'EL REGRESO',
      anios: '2014-2015',
      preguntas: [
        { pregunta: '¿En qué año ganaron su segunda Serie Mundial?', opciones: ['2013', '2014', '2015', '2016'], correcta: 2, nota: 'Treinta años después de la primera.' },
        { pregunta: '¿Contra quién ganaron la Serie Mundial de 2015?', opciones: ['Mets', 'Giants', 'Cardinals', 'Cubs'], correcta: 0, nota: 'Ganaron en cinco juegos.' },
        { pregunta: '¿Contra quién perdieron la Serie Mundial de 2014 en siete juegos?', opciones: ['Giants', 'Nationals', 'Dodgers', 'Cardinals'], correcta: 0, nota: 'Se quedaron a 90 pies de empatar el último juego.' },
        { pregunta: '¿Quién fue el Jugador Más Valioso de la Serie Mundial de 2015?', opciones: ['Eric Hosmer', 'Salvador Pérez', 'Lorenzo Cain', 'Alcides Escobar'], correcta: 1, nota: 'El cátcher bateó .364 en la serie.' },
        { pregunta: '¿Cuántas Series Mundiales tienen los Royals?', opciones: ['Una', 'Dos', 'Tres', 'Cuatro'], correcta: 1, nota: '1985 y 2015.' },
      ],
    },
  ],
  twins: [
    {
      id: 'senadores',
      nombre: 'DE SENADORES A TWINS',
      anios: '1901-1965',
      preguntas: [
        { pregunta: '¿En qué ciudad jugaban antes de mudarse a Minnesota?', opciones: ['Washington', 'Kansas City', 'Milwaukee', 'Baltimore'], correcta: 0, nota: 'Se llamaban los Senadores.' },
        { pregunta: '¿En qué año se mudaron a Minnesota?', opciones: ['1954', '1961', '1965', '1970'], correcta: 1, nota: 'El nombre Twins viene de las ciudades gemelas.' },
        { pregunta: '¿En qué año ganaron su primer título, todavía como Senadores?', opciones: ['1912', '1924', '1933', '1940'], correcta: 1, nota: 'Le ganaron a los Giants en siete juegos.' },
        { pregunta: '¿Quién fue el lanzador estrella de los Senadores, con 417 victorias?', opciones: ['Walter Johnson', 'Cy Young', 'Lefty Grove', 'Bob Feller'], correcta: 0, nota: 'Es el segundo con más victorias en la historia.' },
        { pregunta: '¿En qué año llegaron a la Serie Mundial ya como Twins?', opciones: ['1962', '1965', '1969', '1970'], correcta: 1, nota: 'Perdieron contra los Dodgers de Koufax.' },
      ],
    },
    {
      id: 'puckett',
      nombre: 'KIRBY PUCKETT',
      anios: '1987-1991',
      preguntas: [
        { pregunta: '¿En qué años ganaron la Serie Mundial?', opciones: ['1965 y 1987', '1987 y 1991', '1991 y 2002', '1987 y 2006'], correcta: 1, nota: 'Ganaron los siete juegos que jugaron en casa.' },
        { pregunta: '¿Contra quién ganaron la Serie Mundial de 1991?', opciones: ['Bravos', 'Cardinals', 'Blue Jays', 'Pirates'], correcta: 0, nota: 'Cuatro juegos se decidieron por una carrera.' },
        { pregunta: '¿Quién lanzó diez entradas sin carrera en el séptimo juego de 1991?', opciones: ['Jack Morris', 'Frank Viola', 'Kevin Tapani', 'Scott Erickson'], correcta: 0, nota: 'Ganaron 1-0 en la décima.' },
        { pregunta: '¿Cómo se llamaba el estadio techado donde jugaban?', opciones: ['Metrodome', 'Target Field', 'Kingdome', 'Astrodome'], correcta: 0, nota: 'El techo de lona hacía un ruido enorme.' },
        { pregunta: '¿Cuántas Series Mundiales tienen los Twins?', opciones: ['Dos', 'Tres', 'Cuatro', 'Cinco'], correcta: 1, nota: '1924, 1987 y 1991.' },
      ],
    },
    {
      id: 'target-field',
      nombre: 'LA ERA DEL TARGET FIELD',
      anios: '2010-hoy',
      preguntas: [
        { pregunta: '¿En qué año abrió Target Field?', opciones: ['2006', '2010', '2013', '2016'], correcta: 1, nota: 'Volvieron a jugar al aire libre después de 28 años.' },
        { pregunta: '¿Quién ganó el premio al Jugador Más Valioso en 2009?', opciones: ['Joe Mauer', 'Justin Morneau', 'Michael Cuddyer', 'Torii Hunter'], correcta: 0, nota: 'Bateó .365 ese año.' },
        { pregunta: '¿Cuántos títulos de bateo ganó Joe Mauer?', opciones: ['Uno', 'Dos', 'Tres', 'Cuatro'], correcta: 2, nota: 'Ningún otro cátcher de la Liga Americana ha ganado uno.' },
        { pregunta: '¿Quién es el líder histórico de jonrones de la franquicia?', opciones: ['Harmon Killebrew', 'Kirby Puckett', 'Joe Mauer', 'Justin Morneau'], correcta: 0, nota: 'Pegó 573 en su carrera.' },
        { pregunta: '¿En qué año rompieron su racha de 18 derrotas seguidas en playoffs?', opciones: ['2019', '2020', '2023', '2024'], correcta: 2, nota: 'La racha venía desde 2004.' },
      ],
    },
  ],
  'white-sox': [
    {
      id: 'black-sox',
      nombre: 'LOS BLACK SOX',
      anios: '1917-1920',
      preguntas: [
        { pregunta: '¿En qué año ganaron la Serie Mundial antes del escándalo?', opciones: ['1906', '1917', '1919', '1920'], correcta: 1, nota: 'Le ganaron a los Giants en seis juegos.' },
        { pregunta: '¿Qué pasó en la Serie Mundial de 1919?', opciones: ['Se suspendió', 'Ocho jugadores la arreglaron', 'Hubo empate', 'No se jugó'], correcta: 1, nota: 'Perdieron a propósito contra los Reds.' },
        { pregunta: '¿Cuál es el jugador más famoso de los expulsados?', opciones: ['Shoeless Joe Jackson', 'Eddie Collins', 'Ray Schalk', 'Red Faber'], correcta: 0, nota: 'Tenía .356 de por vida cuando lo expulsaron.' },
        { pregunta: '¿Cuántos jugadores fueron expulsados de por vida?', opciones: ['Cinco', 'Seis', 'Siete', 'Ocho'], correcta: 3, nota: 'Ninguno volvió a jugar en Grandes Ligas.' },
        { pregunta: '¿En qué año ganaron su primera Serie Mundial?', opciones: ['1901', '1906', '1917', '1919'], correcta: 1, nota: 'Les decían los "Hitless Wonders".' },
      ],
    },
    {
      id: 'go-go',
      nombre: 'LOS GO-GO SOX',
      anios: '1951-1967',
      preguntas: [
        { pregunta: '¿En qué año llegaron a la Serie Mundial en esa época?', opciones: ['1955', '1959', '1963', '1967'], correcta: 1, nota: 'Fue su única aparición en 40 años.' },
        { pregunta: '¿Contra quién perdieron esa Serie Mundial?', opciones: ['Dodgers', 'Yankees', 'Giants', 'Braves'], correcta: 0, nota: 'Perdieron en seis juegos.' },
        { pregunta: '¿Por qué les decían los Go-Go Sox?', opciones: ['Por sus jonrones', 'Por su velocidad y sus robos', 'Por su pitcheo', 'Por su estadio'], correcta: 1, nota: 'Ganaban con toques, robos y defensa.' },
        { pregunta: '¿Quién fue el segunda base que ganó el MVP en 1959?', opciones: ['Nellie Fox', 'Luis Aparicio', 'Minnie Miñoso', 'Sherm Lollar'], correcta: 0, nota: 'Ponchó solo 13 veces esa temporada.' },
        { pregunta: '¿Cómo se llamaba su estadio entonces?', opciones: ['Comiskey Park', 'Wrigley Field', 'Sox Park', 'South Side Park'], correcta: 0, nota: 'Lo llamaban el parque de los fuegos artificiales.' },
      ],
    },
    {
      id: 'titulo-2005',
      nombre: 'EL TÍTULO DE 2005',
      anios: '2005',
      preguntas: [
        { pregunta: '¿En qué año rompieron su sequía de 88 años?', opciones: ['2000', '2005', '2008', '2012'], correcta: 1, nota: 'Ganaron 11 de 12 juegos en playoffs.' },
        { pregunta: '¿A quién barrieron en la Serie Mundial de 2005?', opciones: ['Astros', 'Cardinals', 'Angels', 'Red Sox'], correcta: 0, nota: 'Ganaron los cuatro juegos, tres de ellos por una carrera.' },
        { pregunta: '¿Qué hicieron sus abridores en la Serie de Campeonato de 2005?', opciones: ['Lanzaron cuatro juegos completos seguidos', 'Todos fueron novatos', 'Ninguno ganó', 'Lanzaron sin ponches'], correcta: 0, nota: 'Algo que no se veía desde los años setenta.' },
        { pregunta: '¿Quién es el líder histórico de jonrones de la franquicia?', opciones: ['Frank Thomas', 'Paul Konerko', 'Harold Baines', 'Carlton Fisk'], correcta: 0, nota: 'Le decían el Big Hurt.' },
        { pregunta: '¿Cómo se llama hoy su estadio?', opciones: ['Rate Field', 'Comiskey Park', 'Guaranteed Park', 'Chicago Field'], correcta: 0, nota: 'Ha cambiado de nombre varias veces desde 1991.' },
      ],
    },
  ],
  astros: [
    {
      id: 'astrodome',
      nombre: 'COLT .45S Y EL ASTRODOME',
      anios: '1962-1999',
      preguntas: [
        { pregunta: '¿Cómo se llamaban al nacer en 1962?', opciones: ['Colt .45s', 'Buffaloes', 'Oilers', 'Stars'], correcta: 0, nota: 'Cambiaron a Astros en 1965.' },
        { pregunta: '¿En qué año abrió el Astrodome?', opciones: ['1962', '1965', '1970', '1975'], correcta: 1, nota: 'Le decían la octava maravilla del mundo.' },
        { pregunta: '¿Qué tuvo de especial el Astrodome?', opciones: ['Fue el primer estadio techado', 'Fue el más grande', 'Tenía césped natural bajo techo', 'Estaba bajo tierra'], correcta: 0, nota: 'Ahí se inventó el césped artificial.' },
        { pregunta: '¿En qué liga jugaban antes de 2013?', opciones: ['Nacional', 'Americana', 'Federal', 'Del Pacífico'], correcta: 0, nota: 'Son el único equipo que ha llegado a la Serie Mundial por las dos.' },
        { pregunta: '¿Quién lanzó siete juegos sin hit en su carrera y pasó por Houston?', opciones: ['Nolan Ryan', 'J.R. Richard', 'Mike Scott', 'Roy Oswalt'], correcta: 0, nota: 'Es el récord de todos los tiempos.' },
      ],
    },
    {
      id: 'killer-bs',
      nombre: 'BAGWELL Y BIGGIO',
      anios: '1991-2005',
      preguntas: [
        { pregunta: '¿En qué año llegaron a su primera Serie Mundial?', opciones: ['1998', '2001', '2004', '2005'], correcta: 3, nota: 'Después de 43 años de historia.' },
        { pregunta: '¿Contra quién perdieron esa Serie Mundial?', opciones: ['White Sox', 'Cardinals', 'Red Sox', 'Yankees'], correcta: 0, nota: 'Perdieron los cuatro juegos, tres por una carrera.' },
        { pregunta: '¿Quién ganó el premio al Jugador Más Valioso en 1994 con Houston?', opciones: ['Jeff Bagwell', 'Craig Biggio', 'Moisés Alou', 'Lance Berkman'], correcta: 0, nota: 'Ganó por unanimidad en una temporada acortada por la huelga.' },
        { pregunta: '¿Cuántos hits pegó Craig Biggio en su carrera?', opciones: ['2,800', '3,000', '3,060', '3,200'], correcta: 2, nota: 'Todos con Houston.' },
        { pregunta: '¿Cómo les decían a Bagwell, Biggio y compañía?', opciones: ['Los Killer B’s', 'Los Tres Grandes', 'La Maquinaria', 'Los Astros de Oro'], correcta: 0, nota: 'Por la inicial de sus apellidos.' },
      ],
    },
    {
      id: 'titulo-2017',
      nombre: 'EL TÍTULO DE 2017',
      anios: '2015-2022',
      preguntas: [
        { pregunta: '¿En qué año ganaron su primera Serie Mundial?', opciones: ['2015', '2017', '2019', '2021'], correcta: 1, nota: 'Pocas semanas después del huracán Harvey.' },
        { pregunta: '¿Contra quién ganaron la Serie Mundial de 2017?', opciones: ['Dodgers', 'Yankees', 'Nationals', 'Red Sox'], correcta: 0, nota: 'Ganaron en siete juegos.' },
        { pregunta: '¿Quién ganó el premio al Jugador Más Valioso de la Liga Americana en 2017?', opciones: ['Carlos Correa', 'José Altuve', 'George Springer', 'Alex Bregman'], correcta: 1, nota: 'Bateó .346 y es el más bajito de la liga.' },
        { pregunta: '¿En qué año ganaron su segunda Serie Mundial?', opciones: ['2019', '2021', '2022', '2023'], correcta: 2, nota: 'Llegaron a cuatro Series en seis años.' },
        { pregunta: '¿Contra quién ganaron la Serie Mundial de 2022?', opciones: ['Phillies', 'Bravos', 'Nationals', 'Dodgers'], correcta: 0, nota: 'Ganaron en seis juegos.' },
      ],
    },
  ],
  angels: [
    {
      id: 'primeros-angels',
      nombre: 'LOS PRIMEROS AÑOS',
      anios: '1961-1995',
      preguntas: [
        { pregunta: '¿En qué año nacieron los Angels?', opciones: ['1958', '1961', '1965', '1969'], correcta: 1, nota: 'Empezaron jugando en Los Ángeles.' },
        { pregunta: '¿Quién fue su dueño fundador, famoso por sus canciones?', opciones: ['Gene Autry', 'Walt Disney', 'Bing Crosby', 'Bob Hope'], correcta: 0, nota: 'Era actor y cantante de música country.' },
        { pregunta: '¿Cuántas Series Mundiales ganaron antes de 2002?', opciones: ['Ninguna', 'Una', 'Dos', 'Tres'], correcta: 0, nota: 'Tardaron 41 años en llegar a una.' },
        { pregunta: '¿Cuántos juegos sin hit lanzó Nolan Ryan con los Angels?', opciones: ['Dos', 'Tres', 'Cuatro', 'Cinco'], correcta: 2, nota: 'Ponchó 383 bateadores en 1973, récord de la era moderna.' },
        { pregunta: '¿Cómo se llama su estadio?', opciones: ['Angel Stadium', 'Dodger Stadium', 'Anaheim Park', 'Disney Field'], correcta: 0, nota: 'Abrió en 1966 y le dicen The Big A.' },
      ],
    },
    {
      id: 'titulo-2002',
      nombre: 'EL TÍTULO DE 2002',
      anios: '2002',
      preguntas: [
        { pregunta: '¿En qué año ganaron su única Serie Mundial?', opciones: ['1979', '1986', '2002', '2009'], correcta: 2, nota: 'Entraron a playoffs como comodín.' },
        { pregunta: '¿Contra quién ganaron esa Serie Mundial?', opciones: ['Giants', 'Yankees', 'Cardinals', 'Twins'], correcta: 0, nota: 'Ganaron en siete juegos.' },
        { pregunta: '¿De cuántas carreras abajo remontaron en el sexto juego?', opciones: ['Tres', 'Cuatro', 'Cinco', 'Seis'], correcta: 2, nota: 'Iban 5-0 abajo en la séptima entrada.' },
        { pregunta: '¿Quién fue el Jugador Más Valioso de esa Serie Mundial?', opciones: ['Troy Glaus', 'Garret Anderson', 'Darin Erstad', 'Tim Salmon'], correcta: 0, nota: 'Pegó tres jonrones en la serie.' },
        { pregunta: '¿Cómo se llamaba la mascota que animaba las remontadas?', opciones: ['Rally Monkey', 'Thunder', 'Halo', 'Big A'], correcta: 0, nota: 'Salía en la pantalla cuando iban perdiendo.' },
      ],
    },
    {
      id: 'era-trout',
      nombre: 'LA ERA TROUT',
      anios: '2011-hoy',
      preguntas: [
        { pregunta: '¿Cuántas veces ha sido Jugador Más Valioso Mike Trout?', opciones: ['Una', 'Dos', 'Tres', 'Cuatro'], correcta: 2, nota: 'En 2014, 2016 y 2019.' },
        { pregunta: '¿Quién jugó como bateador y lanzador al mismo tiempo entre 2018 y 2023?', opciones: ['Shohei Ohtani', 'Mike Trout', 'Anthony Rendon', 'Jared Walsh'], correcta: 0, nota: 'Nadie lo hacía a ese nivel desde Babe Ruth.' },
        { pregunta: '¿En qué año ganó Ohtani su primer premio al Jugador Más Valioso?', opciones: ['2018', '2019', '2021', '2023'], correcta: 2, nota: 'Ganó por unanimidad.' },
        { pregunta: '¿Quién es el líder histórico de jonrones de la franquicia?', opciones: ['Mike Trout', 'Tim Salmon', 'Garret Anderson', 'Albert Pujols'], correcta: 0, nota: 'Pasó a Tim Salmon en 2020.' },
        { pregunta: '¿Cuántas Series Mundiales tienen los Angels?', opciones: ['Ninguna', 'Una', 'Dos', 'Tres'], correcta: 1, nota: 'La de 2002.' },
      ],
    },
  ],
  athletics: [
    {
      id: 'filadelfia',
      nombre: 'FILADELFIA Y CONNIE MACK',
      anios: '1901-1954',
      preguntas: [
        { pregunta: '¿En qué ciudad nacieron los Athletics?', opciones: ['Filadelfia', 'Kansas City', 'Oakland', 'Pittsburgh'], correcta: 0, nota: 'Se mudaron a Kansas City en 1955.' },
        { pregunta: '¿Cuántos años dirigió Connie Mack al equipo?', opciones: ['25', '35', '50', '60'], correcta: 2, nota: 'También era el dueño, así que nadie podía correrlo.' },
        { pregunta: '¿En qué año ganaron su primera Serie Mundial?', opciones: ['1905', '1910', '1913', '1929'], correcta: 1, nota: 'Le ganaron a los Cubs.' },
        { pregunta: '¿Quién pegó 58 jonrones en 1932?', opciones: ['Jimmie Foxx', 'Al Simmons', 'Mickey Cochrane', 'Home Run Baker'], correcta: 0, nota: 'Se quedó a dos de la marca de Ruth.' },
        { pregunta: '¿Cuántas Series Mundiales tiene la franquicia?', opciones: ['Siete', 'Ocho', 'Nueve', 'Diez'], correcta: 2, nota: 'Cinco en Filadelfia y cuatro en Oakland.' },
      ],
    },
    {
      id: 'tres-seguidos',
      nombre: 'LOS TRES SEGUIDOS',
      anios: '1972-1974',
      preguntas: [
        { pregunta: '¿Cuántas Series Mundiales seguidas ganaron en los setenta?', opciones: ['Dos', 'Tres', 'Cuatro', 'Cinco'], correcta: 1, nota: 'Solo los Yankees lo habían hecho antes.' },
        { pregunta: '¿En qué ciudad jugaban entonces?', opciones: ['Oakland', 'Kansas City', 'Filadelfia', 'Sacramento'], correcta: 0, nota: 'Llegaron ahí en 1968.' },
        { pregunta: '¿A quién le decían Mr. October y salió de este equipo?', opciones: ['Reggie Jackson', 'Catfish Hunter', 'Rollie Fingers', 'Joe Rudi'], correcta: 0, nota: 'El apodo se lo ganó después, con los Yankees.' },
        { pregunta: '¿Qué tenían de distinto sus uniformes?', opciones: ['Eran verdes y dorados', 'Eran negros', 'No tenían números', 'Eran a rayas rojas'], correcta: 0, nota: 'En una liga donde todos usaban gris y blanco.' },
        { pregunta: '¿Quién robó 130 bases en 1982, récord de una temporada?', opciones: ['Rickey Henderson', 'Bert Campaneris', 'Billy North', 'Vince Coleman'], correcta: 0, nota: 'También es el líder histórico con 1,406.' },
      ],
    },
    {
      id: 'moneyball',
      nombre: 'MONEYBALL EN OAKLAND',
      anios: '2000-2006',
      preguntas: [
        { pregunta: '¿Cuántos juegos seguidos ganaron en 2002?', opciones: ['16', '18', '20', '22'], correcta: 2, nota: 'Récord de la Liga Americana en ese momento.' },
        { pregunta: '¿Quién era el gerente general de esa época?', opciones: ['Billy Beane', 'Sandy Alderson', 'Theo Epstein', 'Brian Cashman'], correcta: 0, nota: 'Armó un equipo competitivo con la nómina más baja.' },
        { pregunta: '¿Quién ganó el premio al Jugador Más Valioso en 2002 con Oakland?', opciones: ['Miguel Tejada', 'Eric Chávez', 'Jason Giambi', 'Barry Zito'], correcta: 0, nota: 'Ese año Zito ganó el Cy Young.' },
        { pregunta: '¿Quiénes eran sus tres grandes abridores?', opciones: ['Hudson, Mulder y Zito', 'Hunter, Blue y Holtzman', 'Haren, Harden y Blanton', 'Bailey, Cahill y Anderson'], correcta: 0, nota: 'Los tres llegaron a las Grandes Ligas casi al mismo tiempo.' },
        { pregunta: '¿A qué ciudad se mudaron en 2025?', opciones: ['Sacramento', 'Las Vegas', 'Portland', 'San José'], correcta: 0, nota: 'Van a jugar ahí mientras construyen su estadio nuevo.' },
      ],
    },
  ],
  mariners: [
    {
      id: 'griffey',
      nombre: 'GRIFFEY Y JOHNSON',
      anios: '1989-1999',
      preguntas: [
        { pregunta: '¿En qué año jugaron su primera temporada?', opciones: ['1969', '1977', '1980', '1985'], correcta: 1, nota: 'Entraron junto con los Blue Jays.' },
        { pregunta: '¿Quién debutó con ellos en 1989, a los 19 años?', opciones: ['Ken Griffey Jr.', 'Álex Rodríguez', 'Edgar Martínez', 'Jay Buhner'], correcta: 0, nota: 'Su papá jugaba todavía en Grandes Ligas.' },
        { pregunta: '¿Quién ganó el Cy Young en 1995 con Seattle?', opciones: ['Randy Johnson', 'Jamie Moyer', 'Freddy García', 'Félix Hernández'], correcta: 0, nota: 'Medía 2.08 metros y le decían la Unidad Gigante.' },
        { pregunta: '¿Qué fue "The Double" de 1995?', opciones: ['Un doble de Edgar Martínez que ganó la serie', 'Un doble juego', 'Dos jonrones seguidos', 'Un doble no hitter'], correcta: 0, nota: 'Griffey anotó desde primera y salvaron al equipo de mudarse.' },
        { pregunta: '¿En qué estadio jugaban antes de 1999?', opciones: ['Kingdome', 'Safeco Field', 'Sicks Stadium', 'Emerald Park'], correcta: 0, nota: 'Era techado y de concreto.' },
      ],
    },
    {
      id: 'ichiro',
      nombre: 'ICHIRO Y LAS 116',
      anios: '2000-2003',
      preguntas: [
        { pregunta: '¿Cuántos juegos ganaron en 2001?', opciones: ['110', '114', '116', '120'], correcta: 2, nota: 'Igualaron el récord de los Cubs de 1906.' },
        { pregunta: '¿Qué premios ganó Ichiro Suzuki en 2001?', opciones: ['Solo el Novato del Año', 'Novato del Año y Jugador Más Valioso', 'Solo el MVP', 'Guante de Oro y Cy Young'], correcta: 1, nota: 'Llegó desde Japón a los 27 años.' },
        { pregunta: '¿Cuántos hits pegó Ichiro en 2004, récord de Grandes Ligas?', opciones: ['242', '257', '262', '270'], correcta: 2, nota: 'Rompió una marca de 1920.' },
        { pregunta: '¿Hasta dónde llegaron en los playoffs de 2001?', opciones: ['Serie Mundial', 'Serie de Campeonato', 'Serie Divisional', 'No calificaron'], correcta: 1, nota: 'Perdieron contra los Yankees.' },
        { pregunta: '¿Cuántas Series Mundiales han ganado los Mariners?', opciones: ['Ninguna', 'Una', 'Dos', 'Tres'], correcta: 0, nota: 'Son el único equipo que nunca ha llegado a una.' },
      ],
    },
    {
      id: 'regreso-seattle',
      nombre: 'EL REGRESO',
      anios: '2022-hoy',
      preguntas: [
        { pregunta: '¿Cuántos años pasaron sin llegar a playoffs?', opciones: ['15', '18', '21', '25'], correcta: 2, nota: 'Fue la sequía más larga de todo el deporte profesional de Estados Unidos.' },
        { pregunta: '¿En qué año volvieron a los playoffs?', opciones: ['2018', '2021', '2022', '2023'], correcta: 2, nota: 'Remontaron cuatro carreras en el último juego de la serie de comodines.' },
        { pregunta: '¿Quién ganó el Novato del Año de la Liga Americana en 2022?', opciones: ['Julio Rodríguez', 'Cal Raleigh', 'Logan Gilbert', 'George Kirby'], correcta: 0, nota: 'Firmó una extensión que puede llegar a 17 años.' },
        { pregunta: '¿Cómo se llama su estadio?', opciones: ['T-Mobile Park', 'Safeco Field', 'Kingdome', 'Rainier Park'], correcta: 0, nota: 'Es el mismo de 1999, con otro nombre desde 2019.' },
        { pregunta: '¿Quién es el líder histórico de jonrones de la franquicia?', opciones: ['Ken Griffey Jr.', 'Edgar Martínez', 'Jay Buhner', 'Nelson Cruz'], correcta: 0, nota: 'Pegó 417 con Seattle.' },
      ],
    },
  ],
  rangers: [
    {
      id: 'senadores-texas',
      nombre: 'DE SENADORES A TEXAS',
      anios: '1961-1989',
      preguntas: [
        { pregunta: '¿En qué ciudad nacieron en 1961?', opciones: ['Washington', 'Dallas', 'Houston', 'Kansas City'], correcta: 0, nota: 'Fueron los segundos Senadores de Washington.' },
        { pregunta: '¿En qué año se mudaron a Texas?', opciones: ['1969', '1972', '1975', '1980'], correcta: 1, nota: 'Se instalaron en Arlington.' },
        { pregunta: '¿Quién lanzó su séptimo juego sin hit con los Rangers?', opciones: ['Nolan Ryan', 'Charlie Hough', 'Ferguson Jenkins', 'Kenny Rogers'], correcta: 0, nota: 'Nadie más ha lanzado más de cuatro.' },
        { pregunta: '¿A qué edad lanzó Ryan ese último juego sin hit?', opciones: ['38', '40', '44', '46'], correcta: 2, nota: 'Fue en 1991, contra Toronto.' },
        { pregunta: '¿Qué otro lanzador de los Rangers lanzó un juego perfecto en 1994?', opciones: ['Kenny Rogers', 'Bobby Witt', 'Rick Helling', 'John Wetteland'], correcta: 0, nota: 'Es el único juego perfecto de la franquicia.' },
      ],
    },
    {
      id: 'pudge',
      nombre: 'LOS AÑOS DE PUDGE',
      anios: '1990-2003',
      preguntas: [
        { pregunta: '¿Quién ganó el premio al Jugador Más Valioso en 1999 como cátcher?', opciones: ['Iván Rodríguez', 'Juan González', 'Rafael Palmeiro', 'Rusty Greer'], correcta: 0, nota: 'Le decían Pudge y tenía el mejor brazo de la liga.' },
        { pregunta: '¿Cuántas veces fue Jugador Más Valioso Juan González?', opciones: ['Una', 'Dos', 'Tres', 'Ninguna'], correcta: 1, nota: 'En 1996 y en 1998.' },
        { pregunta: '¿Qué bateador de los Rangers pasó los 500 jonrones y los 3,000 hits?', opciones: ['Rafael Palmeiro', 'Juan González', 'Iván Rodríguez', 'Michael Young'], correcta: 0, nota: 'Solo unos pocos jugadores han hecho las dos cosas.' },
        { pregunta: '¿Cuántos títulos de división ganaron entre 1996 y 1999?', opciones: ['Uno', 'Dos', 'Tres', 'Cuatro'], correcta: 2, nota: '1996, 1998 y 1999.' },
        { pregunta: '¿Contra quién perdieron en playoffs esas tres veces?', opciones: ['Yankees', 'Red Sox', 'Indians', 'Mariners'], correcta: 0, nota: 'Ganaron un solo juego en las tres series juntas.' },
      ],
    },
    {
      id: 'series-rangers',
      nombre: 'LAS SERIES MUNDIALES',
      anios: '2010-2023',
      preguntas: [
        { pregunta: '¿En qué años llegaron a la Serie Mundial de forma seguida?', opciones: ['2010 y 2011', '2011 y 2012', '2009 y 2010', '2012 y 2013'], correcta: 0, nota: 'Perdieron las dos.' },
        { pregunta: '¿A cuántos strikes estuvieron de ganar la Serie de 2011?', opciones: ['Un strike', 'Dos strikes', 'Tres strikes', 'Un out'], correcta: 0, nota: 'Les pasó dos veces en el mismo juego.' },
        { pregunta: '¿En qué año ganaron su primera Serie Mundial?', opciones: ['2015', '2020', '2022', '2023'], correcta: 3, nota: 'Ganaron todos sus juegos como visitantes en esos playoffs.' },
        { pregunta: '¿Contra quién ganaron la Serie Mundial de 2023?', opciones: ['Diamondbacks', 'Astros', 'Phillies', 'Braves'], correcta: 0, nota: 'Ganaron en cinco juegos.' },
        { pregunta: '¿Cómo se llama su estadio?', opciones: ['Globe Life Field', 'Rangers Ballpark', 'Arlington Stadium', 'Texas Park'], correcta: 0, nota: 'Abrió en 2020 y tiene techo retráctil.' },
      ],
    },
  ],
}

// Todas las epocas de un equipo, para pintar la lista
export function epocasDe(teamId) {
  return triviaPorEquipo[teamId] || []
}

export function buscarEpoca(teamId, epocaId) {
  return epocasDe(teamId).find((epoca) => epoca.id === epocaId) || null
}

export const PREGUNTAS_POR_EPOCA = 5
export const EPOCAS_POR_EQUIPO = 3
