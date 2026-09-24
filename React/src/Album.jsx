import { useNavigate } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'
import AlbumCartas from './cartas/AlbumCartas'
import { TOTAL_CARTAS, cartas } from './cartas/cartasData'
import { useJugador } from './almacen/useJugador'

export default function Album() {
  const navigate = useNavigate()
  const { perfil } = useJugador()
  const distintas = cartas.filter((carta) => perfil.cartas[carta.id] > 0).length

  return (
    <main className="album-shell">
      <PageHeader title="ÁLBUM" backTo="/perfil" rightLabel={`${distintas}/${TOTAL_CARTAS}`} />

      <section className="album-content" aria-label="Colección de cartas">
        <AlbumCartas obtenidas={perfil.cartas} onAbrir={(carta) => navigate(`/album/${carta.id}`)} />
      </section>

      <BottomNav activeTab="perfil" onTabChange={() => {}} />
    </main>
  )
}
