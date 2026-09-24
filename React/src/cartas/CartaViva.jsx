import { useState } from 'react'

import Carta from './Carta'
import VisorCarta from './VisorCarta'

// La carta con el brillo bueno: el sombreador WebGL encima y la version CSS
// debajo, que se ve mientras cargan las texturas y si WebGL falla. Solo se usa
// donde hay una carta a la vez: cada visor gasta un contexto WebGL.
export default function CartaViva({ carta, webgl = false, volteada = false }) {
  const [fallo, setFallo] = useState(false)

  return (
    <div className="carta-viva">
      <Carta carta={carta} interactiva={!webgl || fallo} />
      {webgl && !fallo && (
        <div className="carta-viva__visor">
          <VisorCarta carta={carta} volteada={volteada} onError={() => setFallo(true)} />
        </div>
      )}
    </div>
  )
}
