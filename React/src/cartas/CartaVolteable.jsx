import { useState } from 'react'

import Carta from './Carta'
import VisorCarta from './VisorCarta'
import { RUTA_DORSO } from './cartasData'

// El volteo lo hace el mismo sombreador, que ya pinta el dorso en la cara de
// atras: asi la carta no cambia de tamano ni parpadea al revelarse
export default function CartaVolteable({ carta, revelada }) {
  const [fallo, setFallo] = useState(false)

  if (fallo) {
    return (
      <div className={revelada ? 'volteable es-revelada' : 'volteable'}>
        <img className="volteable__dorso" src={RUTA_DORSO} alt="" aria-hidden="true" draggable="false" />
        <div className="volteable__frente" aria-hidden={!revelada}>
          <Carta carta={carta} interactiva={revelada} />
        </div>
      </div>
    )
  }

  return (
    <div className="volteable-3d">
      <VisorCarta carta={carta} volteada={!revelada} onError={() => setFallo(true)} />
    </div>
  )
}
