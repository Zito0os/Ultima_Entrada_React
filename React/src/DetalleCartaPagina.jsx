import { Navigate, useNavigate, useParams } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'
import DetalleCarta from './cartas/DetalleCarta'
import { buscarCarta } from './cartas/cartasData'
import { useJugador } from './almacen/useJugador'

// Solo se inspeccionan las cartas propias: por la URL no se abre una ajena
export default function DetalleCartaPagina() {
  const { cartaId } = useParams()
  const navigate = useNavigate()
  const { perfil } = useJugador()
  const carta = buscarCarta(cartaId)
  const cantidad = perfil.cartas[cartaId] || 0

  if (!carta || !cantidad) {
    return <Navigate to="/album" replace />
  }

  return (
    <main className="carta-detalle-shell">
      <PageHeader title="" backTo="/album" />
      <section className="carta-detalle-content">
        <DetalleCarta carta={carta} cantidad={cantidad} onVerAR={() => navigate(`/ar/carta/${carta.id}`)} />
      </section>
      <BottomNav activeTab="perfil" onTabChange={() => {}} />
    </main>
  )
}
