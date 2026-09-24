import { useCallback } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import VerCartaAR from './cartas/VerCartaAR'
import { buscarCarta } from './cartas/cartasData'
import { useJugador } from './almacen/useJugador'
import { comprimir } from './almacen/fotos'

export default function VerCartaARPagina() {
  const { cartaId } = useParams()
  const navigate = useNavigate()
  const { perfil, acciones } = useJugador()
  const carta = buscarCarta(cartaId)

  // La foto en AR tambien entra a la galeria, igual que la de los escudos
  const registrarFoto = useCallback(
    (fotografiada, lienzo) => acciones.guardarFoto(`${fotografiada.jugador} en AR`, comprimir(lienzo)),
    [acciones],
  )

  if (!carta || !perfil.cartas[cartaId]) {
    return <Navigate to="/album" replace />
  }

  return <VerCartaAR carta={carta} onSalir={() => navigate(`/album/${carta.id}`)} onFoto={registrarFoto} />
}
