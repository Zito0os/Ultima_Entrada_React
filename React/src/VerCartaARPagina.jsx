import { useCallback } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import VerCartaAR from './cartas/VerCartaAR'
import { buscarCarta } from './cartas/cartasData'
import { useJugador } from './almacen/useJugador'

export default function VerCartaARPagina() {
  const { cartaId } = useParams()
  const navigate = useNavigate()
  const { perfil, acciones } = useJugador()
  const carta = buscarCarta(cartaId)

  // La foto en AR tambien entra a la galeria, igual que la de los escudos
  const registrarFoto = useCallback((fotografiada) => {
    acciones.agregarFotos([{
      id: `foto-${Date.now()}`,
      nombre: `${fotografiada.jugador} en AR`,
      editada: false,
      creada: new Date().toISOString(),
    }])
  }, [acciones])

  if (!carta || !perfil.cartas[cartaId]) {
    return <Navigate to="/album" replace />
  }

  return <VerCartaAR carta={carta} onSalir={() => navigate(`/album/${carta.id}`)} onFoto={registrarFoto} />
}
