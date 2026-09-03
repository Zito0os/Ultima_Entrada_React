// Las seis epocas de la propuesta. Cada una trae el texto largo de la pantalla
// de detalle, seis hitos con su nota ampliada y tres figuras de la epoca.
export const historyEvents = [
  {
    id: 'origenes',
    period: '1869-1900',
    title: 'LOS ORÍGENES',
    description: 'Del primer equipo profesional a las ligas organizadas.',
    videos: 2,
    texto: [
      'Antes de que existiera la Liga Americana, el béisbol ya llevaba treinta años organizándose. En 1869 los Red Stockings de Cincinnati se declararon el primer equipo abiertamente profesional: pagaban sueldo a sus jugadores y recorrieron el país sin perder un solo juego. Hasta entonces cobrar por jugar era algo que se hacía a escondidas.',
      'La Liga Nacional se fundó en 1876 y pasó dos décadas peleando contra ligas rivales que le disputaban jugadores y ciudades. En ese desorden se fijaron las reglas que todavía gobiernan el juego, empezando por la distancia del lanzador al home. Al cerrar el siglo, una liga menor del medio oeste cambió de nombre y se preparó para dar el salto.',
    ],
    milestones: [
      {
        year: '1869',
        text: 'Los Red Stockings de Cincinnati se vuelven el primer equipo pagado.',
        nota: 'Ganaron los cincuenta y siete juegos que disputaron ese año. Pagar sueldos dejó de ser un secreto y el béisbol se convirtió en negocio.',
      },
      {
        year: '1871',
        text: 'Nace la primera liga formada solo por equipos profesionales.',
        nota: 'Duró cinco temporadas. La falta de reglas claras para fichajes y apuestas la hundió, pero dejó instalada la idea de un calendario común.',
      },
      {
        year: '1876',
        text: 'Se funda la Liga Nacional con ocho clubes.',
        nota: 'Cambió el poder de los jugadores a los dueños: contratos firmes, calendario obligatorio y expulsión para quien apostara.',
      },
      {
        year: '1882',
        text: 'La Asociación Americana le pone competencia a la Liga Nacional.',
        nota: 'Cobraba la mitad por la entrada, vendía cerveza y jugaba en domingo. Duró diez temporadas y forzó el primer acuerdo entre ligas.',
      },
      {
        year: '1893',
        text: 'El lanzador se aleja a sesenta pies y seis pulgadas del home.',
        nota: 'Es la distancia que sigue vigente. Los promedios de bateo subieron de golpe y el juego se pareció por fin al de hoy.',
      },
      {
        year: '1900',
        text: 'La Liga Occidental cambia de nombre y se llama Liga Americana.',
        nota: 'Todavía era una liga menor. Al año siguiente se declaró mayor por su cuenta, y ahí empieza la historia de este archivo.',
      },
    ],
    figuras: [
      { nombre: 'HARRY WRIGHT', papel: 'Mánager', texto: 'Armó el plantel pagado de 1869 y definió cómo se entrena un equipo profesional.' },
      { nombre: 'ALBERT SPALDING', papel: 'Lanzador y dueño', texto: 'Pasó de estrella del montículo a fabricante de pelotas y empujó la fundación de la Liga Nacional.' },
      { nombre: 'BAN JOHNSON', papel: 'Dirigente', texto: 'Presidente de la Liga Occidental. Preparó el terreno para convertirla en la Liga Americana.' },
    ],
  },
  {
    id: 'liga-americana',
    period: '1901-1919',
    title: 'NACE LA LIGA AMERICANA',
    description: 'La liga se funda y llega la primera Serie Mundial.',
    videos: 2,
    texto: [
      'La Liga Americana se declaró liga mayor en 1901 con ocho equipos y una estrategia simple: pagar mejor. Se llevó a decenas de jugadores de la Liga Nacional en dos temporadas, hasta que en 1903 las dos firmaron la paz y aceptaron convivir. Ese mismo otoño Boston y Pittsburgh jugaron la primera Serie Mundial moderna.',
      'Fue la era de la pelota muerta: se usaba la misma pelota hasta que se deshacía, así que casi no había jonrones y el juego se ganaba con toque, robo de base y pitcheo. La época cerró de la peor manera, con ocho jugadores de los White Sox pactando perder la Serie Mundial de 1919.',
    ],
    milestones: [
      {
        year: '1901',
        text: 'La Liga Americana se declara liga mayor con ocho equipos.',
        nota: 'Chicago, Boston, Detroit, Cleveland, Filadelfia, Washington, Baltimore y Milwaukee. Varias de esas franquicias siguen en la liga, aunque hayan cambiado de ciudad.',
      },
      {
        year: '1903',
        text: 'Boston y Pittsburgh juegan la primera Serie Mundial moderna.',
        nota: 'Boston ganó cinco juegos a tres. La serie era al mejor de nueve, no de siete como ahora.',
      },
      {
        year: '1904',
        text: 'No hay Serie Mundial.',
        nota: 'El dueño de los Giants de Nueva York se negó a jugar contra una liga que consideraba inferior. Al año siguiente se volvió obligatoria.',
      },
      {
        year: '1908',
        text: 'Ty Cobb gana el primero de sus títulos de bateo.',
        nota: 'Encadenó nueve seguidos y llegó a doce en total, todos con Detroit.',
      },
      {
        year: '1912',
        text: 'Abre Fenway Park en Boston.',
        nota: 'Sigue en uso más de un siglo después. Es el parque más antiguo de Grandes Ligas.',
      },
      {
        year: '1919',
        text: 'Ocho jugadores de los White Sox pactan perder la Serie Mundial.',
        nota: 'Fueron expulsados de por vida al año siguiente. El caso obligó a crear la figura del comisionado para gobernar el béisbol.',
      },
    ],
    figuras: [
      { nombre: 'BAN JOHNSON', papel: 'Presidente', texto: 'Fundador de la Liga Americana. Impuso el respeto al árbitro como seña de identidad frente a la Liga Nacional.' },
      { nombre: 'TY COBB', papel: 'Jardinero', texto: 'El bateador dominante de la pelota muerta. Veintidós temporadas en Detroit y doce títulos de bateo.' },
      { nombre: 'WALTER JOHNSON', papel: 'Lanzador', texto: 'Ganó 417 juegos con los Senadores de Washington, la segunda cifra más alta de la historia.' },
    ],
  },
  {
    id: 'babe-ruth',
    period: '1920-1946',
    title: 'LA ERA DE BABE RUTH',
    description: 'El jonrón cambia el juego y nace la dinastía de Nueva York.',
    videos: 2,
    texto: [
      'En 1920 Boston vendió a Babe Ruth a los Yankees y el juego cambió de forma. Ruth conectó cincuenta y cuatro jonrones esa temporada, más que cualquier equipo completo salvo uno. La liga cambió las reglas de la pelota el mismo año y el jonrón pasó de rareza a espectáculo principal.',
      'Nueva York construyó sobre eso la primera dinastía del béisbol y ganó su primer título en 1923, el año que inauguró el Yankee Stadium. Fue también la época en que el deporte se volvió espectáculo nacional, con radio, juegos nocturnos y el primer Juego de Estrellas. Y con una barrera intacta: ningún jugador negro podía firmar con un club de Grandes Ligas.',
    ],
    milestones: [
      {
        year: '1920',
        text: 'Babe Ruth llega a los Yankees y conecta cincuenta y cuatro jonrones.',
        nota: 'El récord anterior también era suyo, con veintinueve. Solo un equipo entero conectó más que él solo ese año.',
      },
      {
        year: '1923',
        text: 'Abre el Yankee Stadium y Nueva York gana su primer título.',
        nota: 'Lo apodaron la casa que Ruth construyó, porque la taquilla que él generaba pagó la obra.',
      },
      {
        year: '1927',
        text: 'Ruth establece el récord de sesenta jonrones en una temporada.',
        nota: 'Ese equipo de los Yankees es de los más dominantes que se han armado, y el récord duró treinta y cuatro años.',
      },
      {
        year: '1933',
        text: 'Se juega el primer Juego de Estrellas.',
        nota: 'Fue en Chicago, como parte de la Feria Mundial. Lo ganó la Liga Americana y Ruth conectó el primer jonrón del evento.',
      },
      {
        year: '1939',
        text: 'Lou Gehrig se retira tras 2,130 juegos seguidos.',
        nota: 'Su récord duró cincuenta y seis años, hasta que Cal Ripken Jr. lo superó en 1995.',
      },
      {
        year: '1941',
        text: 'Ted Williams batea .406 en la temporada.',
        nota: 'Nadie ha vuelto a llegar a .400 desde entonces. Se negó a sentarse el último día para proteger el número.',
      },
    ],
    figuras: [
      { nombre: 'BABE RUTH', papel: 'Jardinero', texto: 'Convirtió el jonrón en el centro del juego y al béisbol en el deporte más popular del país.' },
      { nombre: 'LOU GEHRIG', papel: 'Primera base', texto: '2,130 juegos seguidos con los Yankees y el discurso de despedida más recordado del deporte.' },
      { nombre: 'TED WILLIAMS', papel: 'Jardinero', texto: 'El último bateador que superó .400 en una temporada. Perdió cinco años completos por dos guerras.' },
    ],
  },
  {
    id: 'integracion',
    period: '1947-1968',
    title: 'INTEGRACIÓN Y DOMINIO',
    description: 'Se rompe la barrera racial y Nueva York encadena títulos.',
    videos: 2,
    texto: [
      'Jackie Robinson debutó con Brooklyn en abril de 1947 y rompió una barrera que llevaba más de sesenta años en pie. Once semanas después Larry Doby hizo lo mismo en la Liga Americana, con Cleveland. La integración tardó otros doce años en completarse: el último equipo en firmar a un jugador negro lo hizo hasta 1959.',
      'En el terreno la época pertenece a los Yankees, que ganaron catorce banderines entre 1949 y 1964 y arrancaron con cinco Series Mundiales seguidas. Cerró en 1968, cuando el pitcheo llegó a un extremo tal que la liga tuvo que bajar el montículo al año siguiente para devolverle terreno al bateo.',
    ],
    milestones: [
      {
        year: '1947',
        text: 'Jackie Robinson rompe la barrera racial en Grandes Ligas.',
        nota: 'Debutó con Brooklyn el 15 de abril. Larry Doby lo hizo en la Liga Americana en julio, con Cleveland.',
      },
      {
        year: '1948',
        text: 'Cleveland gana el que sigue siendo su último título.',
        nota: 'Con Larry Doby y Satchel Paige en el plantel. Desde entonces cargan una de las sequías más largas del béisbol.',
      },
      {
        year: '1949',
        text: 'Los Yankees arrancan cinco Series Mundiales seguidas.',
        nota: 'Ganaron de 1949 a 1953. Ningún equipo ha repetido esa racha.',
      },
      {
        year: '1956',
        text: 'Don Larsen lanza el único juego perfecto de una Serie Mundial.',
        nota: 'Fue en el quinto juego contra Brooklyn. Sigue siendo el único en más de un siglo de Series.',
      },
      {
        year: '1961',
        text: 'Roger Maris conecta sesenta y un jonrones.',
        nota: 'Superó a Ruth en una temporada que tenía ocho juegos más, y eso alimentó años de discusión sobre cuál récord valía.',
      },
      {
        year: '1968',
        text: 'El año del lanzador cierra la época.',
        nota: 'Denny McLain ganó treinta y un juegos con Detroit. La liga bajó el montículo al año siguiente para frenar el dominio del pitcheo.',
      },
    ],
    figuras: [
      { nombre: 'JACKIE ROBINSON', papel: 'Segunda base', texto: 'Rompió la barrera racial del béisbol organizado. Su número está retirado en las treinta franquicias.' },
      { nombre: 'LARRY DOBY', papel: 'Jardinero', texto: 'El primero en hacerlo en la Liga Americana, con Cleveland, once semanas después de Robinson.' },
      { nombre: 'MICKEY MANTLE', papel: 'Jardinero', texto: 'El bate de los Yankees durante su racha más larga de títulos. 536 jonrones, todos con Nueva York.' },
    ],
  },
  {
    id: 'expansion',
    period: '1969-1993',
    title: 'EXPANSIÓN',
    description: 'Nuevas franquicias, divisiones y el bateador designado.',
    videos: 2,
    texto: [
      'En 1969 la liga creció a veinticuatro equipos y se partió en divisiones Este y Oeste, con una serie de campeonato antes de la Serie Mundial. Por primera vez existía una postemporada de verdad y no un solo duelo entre los dos primeros lugares.',
      'Dos cambios marcaron el periodo. En 1973 la Liga Americana adoptó el bateador designado, la diferencia más visible entre las dos ligas durante casi cincuenta años. Y en 1975 un fallo arbitral acabó con la cláusula que ataba al jugador a su club de por vida: llegó la agencia libre y con ella el béisbol moderno de contratos.',
    ],
    milestones: [
      {
        year: '1969',
        text: 'La liga se reparte en divisiones Este y Oeste.',
        nota: 'Entraron cuatro equipos nuevos, entre ellos los Royals de Kansas City, y nació la serie de campeonato de liga.',
      },
      {
        year: '1972',
        text: 'Oakland arranca tres Series Mundiales seguidas.',
        nota: 'Ganaron en 1972, 1973 y 1974 con prácticamente el mismo plantel.',
      },
      {
        year: '1973',
        text: 'La Liga Americana adopta el bateador designado.',
        nota: 'La Liga Nacional tardó cuarenta y nueve años en copiarla, hasta 2022.',
      },
      {
        year: '1975',
        text: 'Un fallo arbitral abre la agencia libre.',
        nota: 'Se acabó la cláusula de reserva. Por primera vez un jugador pudo elegir equipo al terminar su contrato.',
      },
      {
        year: '1977',
        text: 'Entran Toronto y Seattle a la Liga Americana.',
        nota: 'Toronto es el único club fuera de Estados Unidos que ha ganado la Serie Mundial. Seattle sigue sin llegar a una.',
      },
      {
        year: '1991',
        text: 'Minnesota y Atlanta juegan una de las mejores Series Mundiales.',
        nota: 'Cinco de los siete juegos se decidieron por una carrera. El séptimo lo lanzó Jack Morris completo, diez entradas sin permitir carrera.',
      },
    ],
    figuras: [
      { nombre: 'REGGIE JACKSON', papel: 'Jardinero', texto: 'El bateador de las grandes citas. Conectó tres jonrones en un mismo juego de la Serie Mundial de 1977.' },
      { nombre: 'NOLAN RYAN', papel: 'Lanzador', texto: 'Veintisiete temporadas y siete juegos sin hit, más que cualquier otro lanzador.' },
      { nombre: 'CAL RIPKEN JR.', papel: 'Campocorto', texto: 'Empezó en 1982 la racha de 2,632 juegos seguidos que definió a los Orioles de esta época.' },
    ],
  },
  {
    id: 'moderna',
    period: '1994-hoy',
    title: 'LA ERA MODERNA',
    description: 'Comodines, series largas y las sequías que por fin se rompen.',
    videos: 2,
    texto: [
      'La época arranca con una huelga: el paro de jugadores de 1994 canceló la temporada en agosto y dejó al béisbol sin Serie Mundial por primera vez desde 1904. Al volver, en 1995, llegó el comodín y la postemporada pasó de cuatro equipos clasificados a ocho.',
      'Lo que define estos treinta años son las sequías que cayeron una tras otra: Boston en 2004 después de ochenta y seis años, los White Sox en 2005 después de ochenta y ocho, y los Cubs en 2016 después de ciento ocho. En paralelo, la estadística avanzada cambió la forma de armar equipos y la repetición en video entró al terreno en 2014.',
    ],
    milestones: [
      {
        year: '1994',
        text: 'Una huelga cancela la temporada y la Serie Mundial.',
        nota: 'Fue la primera vez sin Serie Mundial desde 1904. El paro duró 232 días y se llevó parte de la temporada siguiente.',
      },
      {
        year: '1995',
        text: 'Llega el comodín y se alarga la postemporada.',
        nota: 'Pasó de cuatro equipos clasificados a ocho, y se agregó una ronda antes de la serie de campeonato.',
      },
      {
        year: '2001',
        text: 'Seattle gana 116 juegos y no llega a la Serie Mundial.',
        nota: 'Es el récord de victorias empatado de la era moderna. Cayeron en la serie de campeonato ante los Yankees.',
      },
      {
        year: '2004',
        text: 'Boston rompe una sequía de ochenta y seis años.',
        nota: 'Remontaron una serie que perdían 0-3 contra los Yankees, algo que ningún equipo había hecho antes.',
      },
      {
        year: '2016',
        text: 'Cae la última gran sequía del béisbol.',
        nota: 'Chicago venció a Cleveland en el séptimo juego, en entradas extra y tras una pausa por lluvia.',
      },
      {
        year: '2023',
        text: 'Texas gana su primer título en sesenta y tres temporadas.',
        nota: 'Ganaron los once juegos que disputaron como visitantes en esa postemporada, algo que nadie había hecho.',
      },
    ],
    figuras: [
      { nombre: 'CAL RIPKEN JR.', papel: 'Campocorto', texto: 'Superó el récord de Gehrig en 1995 y cerró su racha en 2,632 juegos seguidos.' },
      { nombre: 'MARIANO RIVERA', papel: 'Cerrador', texto: 'El relevista de los Yankees en cinco títulos. Primer jugador elegido al Salón de la Fama por unanimidad.' },
      { nombre: 'ICHIRO SUZUKI', papel: 'Jardinero', texto: 'Llegó de Japón en 2001 y ganó novato del año y jugador más valioso en la misma temporada, con Seattle.' },
    ],
  },
]
