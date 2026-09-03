import { useContext } from 'react'

import { JugadorContexto } from './JugadorContexto'

// Unica puerta de las pantallas al perfil guardado
export function useJugador() {
  const valor = useContext(JugadorContexto)
  if (!valor) {
    throw new Error('useJugador necesita estar dentro de JugadorProvider')
  }
  return valor
}
