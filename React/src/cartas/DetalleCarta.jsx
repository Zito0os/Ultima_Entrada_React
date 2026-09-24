import { useState } from 'react'

import BotonGiroscopio from './BotonGiroscopio'
import Carta from './Carta'
import VisorCarta from './VisorCarta'
import './album.css'

// Sin WebGL (o si falla) la inspeccion cae a la version CSS: nunca queda vacia
export default function DetalleCarta({ carta, cantidad, onVerAR }) {
  const [volteada, setVolteada] = useState(false)
  const [sinWebGL, setSinWebGL] = useState(false)

  return (
    <section className="detalle" aria-labelledby="detalle-titulo">
      <div className="detalle__carta">
        {sinWebGL
          ? <Carta carta={carta} interactiva />
          : <VisorCarta carta={carta} volteada={volteada} onError={() => setSinWebGL(true)} />}
      </div>

      <div className="detalle__datos">
        <h1 className="detalle__titulo" id="detalle-titulo">{carta.jugador}</h1>
        <p>{carta.nombre} · {carta.rarezaNombre}</p>
        <p className="detalle__veces">Obtenida {cantidad} {cantidad === 1 ? 'vez' : 'veces'}</p>
      </div>

      <BotonGiroscopio />

      <div className="detalle__acciones">
        <button className="detalle__boton is-principal" type="button" onClick={onVerAR}>VER EN AR</button>
        {!sinWebGL && (
          <button className="detalle__boton" type="button" onClick={() => setVolteada((antes) => !antes)}>
            {volteada ? 'VER FRENTE' : 'VER DORSO'}
          </button>
        )}
      </div>
    </section>
  )
}
