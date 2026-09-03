import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'
import Icono from './Icono'
import { CARTAS_TOTAL, HOLO_TOTAL } from './almacen/esquema'
import { cartas } from './cartasData'
import { rutaEscudo } from './escudosData'
import { useJugador } from './almacen/useJugador'

const filtros = [
  { id: 'todas', nombre: 'TODAS' },
  { id: 'comun', nombre: 'COMÚN' },
  { id: 'especial', nombre: 'ESPECIAL' },
  { id: 'holo', nombre: 'HOLO' },
]

export default function Album() {
  const navigate = useNavigate()
  const { perfil } = useJugador()
  const [filtro, setFiltro] = useState('todas')

  const obtenidas = Object.keys(perfil.cartas).length
  const holo = cartas.filter((carta) => carta.rareza === 'holo' && perfil.cartas[carta.id]).length
  const visibles = cartas.filter((carta) => filtro === 'todas' || carta.rareza === filtro)

  return (
    <main className="album-shell">
      <PageHeader title="ALBUM" backTo="/perfil" rightLabel={`${obtenidas}/${CARTAS_TOTAL}`} />

      <section className="album-content" aria-label="Colección de tarjetas">
        <div className="album-summary">
          <div>
            <span>COLECCIÓN</span>
            <strong>{obtenidas}<span>/{CARTAS_TOTAL}</span></strong>
          </div>
          <div className="holographic-summary">
            <span>HOLOGRÁFICAS</span>
            <strong>{holo}<span>/{HOLO_TOTAL}</span></strong>
          </div>
          <div className="album-progress" aria-label={`${obtenidas} de ${CARTAS_TOTAL} tarjetas coleccionadas`}>
            <span style={{ width: `${(obtenidas / CARTAS_TOTAL) * 100}%` }} />
          </div>
        </div>

        <div className="album-filters" role="tablist" aria-label="Filtrar tarjetas">
          {filtros.map((item) => (
            <button className={filtro === item.id ? 'album-filter is-active' : 'album-filter'} type="button" role="tab" aria-selected={filtro === item.id} onClick={() => setFiltro(item.id)} key={item.id}>
              {item.nombre}
            </button>
          ))}
        </div>

        <section className="album-grid" aria-label="Tarjetas del álbum">
          {visibles.map((carta) => {
            const cantidad = perfil.cartas[carta.id] || 0
            return (
              <button className={cantidad ? `album-card is-${carta.rareza}` : 'album-card is-bloqueada'} type="button" key={carta.id} aria-label={`${carta.nombre} ${carta.rarezaNombre}${cantidad ? '' : ', bloqueada'}`}>
                {cantidad ? <img src={rutaEscudo(carta.equipo)} alt="" aria-hidden="true" loading="lazy" /> : <span className="album-card-mark">?</span>}
                {cantidad > 1 && <b className="album-card-repetida">x{cantidad}</b>}
              </button>
            )
          })}
        </section>

        <button className="ar-card-button" type="button" onClick={() => navigate('/ar/tarjetas')}>
          <span className="ar-card-icon"><Icono nombre="ar" /></span>
          VER AR DE LA TARJETA
        </button>
      </section>

      <BottomNav activeTab="perfil" onTabChange={() => {}} />
    </main>
  )
}
