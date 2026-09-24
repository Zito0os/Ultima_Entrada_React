import { useState } from 'react'

import Carta from './Carta'
import { TOTAL_CARTAS, cartas, rarezas } from './cartasData'
import './album.css'

const FILTROS = [{ id: 'todas', nombre: 'TODAS' }, ...rarezas.map((rareza) => ({ id: rareza.id, nombre: rareza.nombre }))]

// Las que faltan se ven como hueco punteado con su numero, como pide la propuesta
export default function AlbumCartas({ obtenidas, onAbrir }) {
  const [filtro, setFiltro] = useState('todas')
  const distintas = cartas.filter((carta) => obtenidas[carta.id] > 0).length
  const visibles = cartas.filter((carta) => filtro === 'todas' || carta.rareza === filtro)

  return (
    <section className="album" aria-label="Álbum de cartas">
      <div className="album__resumen">
        <strong>{distintas}<span>/{TOTAL_CARTAS}</span></strong>
        <div className="album__barra" role="progressbar" aria-valuenow={distintas} aria-valuemin={0} aria-valuemax={TOTAL_CARTAS} aria-label="Cartas coleccionadas">
          <span style={{ width: `${(distintas / TOTAL_CARTAS) * 100}%` }} />
        </div>
      </div>

      <div className="album__filtros" role="tablist" aria-label="Filtrar por rareza">
        {FILTROS.map((item) => (
          <button className={filtro === item.id ? 'album__filtro is-activo' : 'album__filtro'} type="button" role="tab" aria-selected={filtro === item.id} onClick={() => setFiltro(item.id)} key={item.id}>
            {item.nombre}
          </button>
        ))}
      </div>

      <ul className="album__rejilla">
        {visibles.map((carta) => {
          const cantidad = obtenidas[carta.id] || 0
          return (
            <li key={carta.id}>
              {cantidad ? (
                <button className="album__carta" type="button" onClick={() => onAbrir(carta)} aria-label={`${carta.jugador}, ${carta.nombre}, ${carta.rarezaNombre}`}>
                  <Carta carta={carta} />
                  {cantidad > 1 && <b className="album__repetida">x{cantidad}</b>}
                </button>
              ) : (
                <span className={`album__hueco hueco--${carta.rareza}`} aria-label={`Carta ${carta.numero} sin obtener`}>
                  {String(carta.numero).padStart(3, '0')}
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
