import { useEffect } from 'react'

import { useJugador } from './almacen/useJugador'
import { silenciar } from './sonidos'

// Lleva las preferencias del perfil a donde viven de verdad: el atributo del
// documento para el tema y el interruptor del modulo de sonidos.
export function useTema() {
  const { perfil } = useJugador()
  const tema = perfil.preferencias.tema === 'oscuro' ? 'oscuro' : 'claro'
  const conSonido = perfil.preferencias.sonido !== false

  useEffect(() => {
    document.documentElement.dataset.tema = tema
  }, [tema])

  useEffect(() => {
    silenciar(!conSonido)
  }, [conSonido])

  return { tema, conSonido }
}
