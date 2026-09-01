import { useNavigate } from 'react-router-dom'

import BottomNav from './Navigation'
import Icono from './Icono'
import PageHeader from './PageHeader'

const modos = [
  { id: 'escudos', icono: 'escudo', titulo: 'ESCUDOS', texto: 'Explora equipos y jugadores en realidad aumentada', ruta: '/ar/escudos', tono: 'shield-choice' },
  { id: 'tarjetas', icono: 'cartas', titulo: 'TARJETAS', texto: 'Descubre el contenido de tus tarjetas coleccionables', ruta: '/ar/tarjetas', tono: 'card-choice' },
  { id: 'modelos', icono: 'cubo', titulo: 'MODELOS', texto: 'Mira los escudos en 3D sin encender la cámara', ruta: '/ar/prueba', tono: 'model-choice' },
]

export default function AR() {
  const navigate = useNavigate()

  return (
    <main className="ar-shell">
      <PageHeader title="AR" backTo="/" />

      <section className="ar-selector-content" aria-label="Seleccionar modo de realidad aumentada">
        <p className="ar-selector-kicker">ELIGE UNA EXPERIENCIA</p>
        {modos.map((modo) => (
          <button className={`ar-mode-choice ${modo.tono}`} type="button" onClick={() => navigate(modo.ruta)} key={modo.id}>
            <span><Icono nombre={modo.icono} /></span>
            <strong>{modo.titulo}</strong>
            <small>{modo.texto}</small>
          </button>
        ))}
      </section>

      <BottomNav activeTab="ar" onTabChange={() => {}} />
    </main>
  )
}
