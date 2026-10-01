import BottomNav from './Navigation'
import PageHeader from './PageHeader'

const secciones = [
  {
    titulo: 'MARCAS Y LOGOS',
    items: [
      { nombre: 'Logos de los 15 clubes', detalle: 'Marcas registradas de cada club y de Major League Baseball. Se usan para los escudos 3D y los marcadores de AR.' },
      { nombre: 'Nombres de equipos, estadios y jugadores', detalle: 'Propiedad de sus titulares. Se citan con fines informativos.' },
    ],
  },
  {
    titulo: 'VIDEO Y FOTOGRAFÍA',
    items: [
      { nombre: 'Clips de jugadas y de épocas', detalle: 'Material de archivo de Major League Baseball y de transmisiones históricas. Derechos de sus titulares.' },
      { nombre: 'The Ball Game, Edison, 1898', detalle: 'Dominio público.' },
      { nombre: 'Fotos de jugadores en las cartas', detalle: 'Derechos de sus autores. El arte de las cartas se generó a partir de ellas.' },
    ],
  },
  {
    titulo: 'MODELOS 3D',
    items: [
      { nombre: 'Esqueleto y animaciones del bateador y el pitcher', detalle: 'Adobe Mixamo.' },
      { nombre: 'Guante, trofeos y escudos', detalle: 'Hechos por el equipo en Blender y en código con three.js.' },
    ],
  },
  {
    titulo: 'TIPOGRAFÍAS',
    items: [
      { nombre: 'Clash Display', detalle: 'Indian Type Foundry, vía Fontshare. Licencia gratuita de ITF.' },
      { nombre: 'IBM Plex Sans e IBM Plex Mono', detalle: 'IBM, vía Google Fonts. SIL Open Font License.' },
    ],
  },
  {
    titulo: 'BIBLIOTECAS',
    items: [
      { nombre: 'React, React Router y Vite', detalle: 'Licencia MIT.' },
      { nombre: 'three.js', detalle: 'Licencia MIT.' },
      { nombre: 'MindAR', detalle: 'HiuKim Yuen. Licencia MIT.' },
      { nombre: 'Firebase', detalle: 'Google. Licencia Apache 2.0.' },
    ],
  },
  {
    titulo: 'PROPIO',
    items: [
      { nombre: 'Sonidos', detalle: 'Sintetizados en código con Web Audio, sin archivos de terceros.' },
      { nombre: 'Filtros de video y brillo de las cartas', detalle: 'Sombreadores de WebGL escritos para el proyecto.' },
    ],
  },
]

export default function Creditos() {
  return (
    <main className="creditos-shell">
      <PageHeader title="CRÉDITOS" backTo="/perfil" />

      <section className="creditos-contenido" aria-label="Fuentes y créditos">
        <p className="creditos-intro">
          Proyecto escolar sin fines de lucro para Procesamiento de Imágenes, LMAD, FCFM UANL.
          El material de terceros pertenece a sus titulares y se usa solo con fines educativos.
        </p>

        {secciones.map((seccion) => (
          <article className="creditos-seccion" key={seccion.titulo}>
            <h2>{seccion.titulo}</h2>
            <dl>
              {seccion.items.map((item) => (
                <div className="creditos-item" key={item.nombre}>
                  <dt>{item.nombre}</dt>
                  <dd>{item.detalle}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </section>

      <BottomNav activeTab="perfil" onTabChange={() => {}} />
    </main>
  )
}
