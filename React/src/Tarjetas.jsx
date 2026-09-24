import { useNavigate } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'
import AlbumCartas from './cartas/AlbumCartas'
import { useJugador } from './almacen/useJugador'

// Se elige la carta aqui; en la camara sirve cualquiera de las tres tarjetas impresas
export default function Tarjetas() {
  const navigate = useNavigate()
  const { perfil } = useJugador()
  const tieneCartas = Object.values(perfil.cartas).some((cantidad) => cantidad > 0)

  return (
    <main className="album-shell">
      <PageHeader title="AR" backTo="/ar" />

      <section className="album-content" aria-label="Elegir carta para ver en AR">
        <p className="tarjetas-intro">Elige una de tus cartas y apunta a cualquiera de las tres tarjetas impresas.</p>
        {tieneCartas ? (
          <AlbumCartas obtenidas={perfil.cartas} onAbrir={(carta) => navigate(`/ar/carta/${carta.id}`)} />
        ) : (
          <button className="tarjetas-tienda" type="button" onClick={() => navigate('/sobres')}>
            CONSIGUE TU PRIMER SOBRE
          </button>
        )}
      </section>

      <BottomNav activeTab="ar" onTabChange={() => {}} />
    </main>
  )
}
