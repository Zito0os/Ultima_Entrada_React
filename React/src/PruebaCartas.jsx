import { useState } from 'react'

import PageHeader from './PageHeader'
import Carta from './cartas/Carta'
import VisorCarta from './cartas/VisorCarta'
import BotonGiroscopio from './cartas/BotonGiroscopio'
import { cartas, rarezas } from './cartas/cartasData'
import './cartas/album.css'

const FILTROS = [{ id: 'todas', nombre: 'TODAS' }, ...rarezas.map((rareza) => ({ id: rareza.id, nombre: rareza.nombre }))]

// Pagina de prueba: las 45 cartas como se ven en la app, sin importar cuales
// tiene el jugador. Arriba, la misma carta en CSS y en WebGL para compararlas.
export default function PruebaCartas() {
  const [filtro, setFiltro] = useState('todas')
  const [elegida, setElegida] = useState(cartas[0])
  const [volteada, setVolteada] = useState(false)
  const [fallo, setFallo] = useState(false)

  const visibles = cartas.filter((carta) => filtro === 'todas' || carta.rareza === filtro)

  return (
    <main className="prueba-shell">
      <PageHeader title="Prueba de cartas" backTo="/album" />
      <section className="prueba-content">
        <div className="prueba-cartas__comparar">
          <figure>
            <Carta carta={elegida} interactiva />
            <figcaption>CSS</figcaption>
          </figure>
          <figure>
            {fallo ? <Carta carta={elegida} interactiva /> : <VisorCarta carta={elegida} volteada={volteada} onError={() => setFallo(true)} />}
            <figcaption>{fallo ? 'CSS (WebGL falló)' : 'WEBGL'}</figcaption>
          </figure>
        </div>

        <p className="prueba-nota">{elegida.jugador} · {elegida.nombre} · {elegida.rarezaNombre}</p>
        <div className="prueba-cartas__acciones">
          <BotonGiroscopio />
          <button className="album__filtro" type="button" onClick={() => setVolteada((antes) => !antes)} disabled={fallo}>
            {volteada ? 'VER EL FRENTE' : 'VER EL DORSO'}
          </button>
        </div>

        <div className="album__filtros" role="tablist" aria-label="Filtrar por rareza">
          {FILTROS.map((item) => (
            <button
              className={filtro === item.id ? 'album__filtro is-activo' : 'album__filtro'}
              type="button"
              role="tab"
              aria-selected={filtro === item.id}
              onClick={() => setFiltro(item.id)}
              key={item.id}
            >
              {item.nombre}
            </button>
          ))}
        </div>

        <ul className="album__rejilla">
          {visibles.map((carta) => (
            <li key={carta.id}>
              <button className="album__carta" type="button" onClick={() => setElegida(carta)} aria-label={`Ver ${carta.jugador}`}>
                <Carta carta={carta} />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
