import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'
import { packs } from './packsData'
import { useJugador } from './almacen/useJugador'

export default function Sobres() {
  const navigate = useNavigate()
  const { perfil, acciones } = useJugador()
  const [aviso, setAviso] = useState('')

  const comprar = (pack) => {
    if (!acciones.gastarMonedas(pack.price)) {
      setAviso(`Te faltan ${pack.price - perfil.monedas} monedas para ese sobre.`)
      return
    }
    navigate(`/sobres/${pack.id}`)
  }

  return (
    <main className="packs-shell">
      <PageHeader title="TIENDA" backTo="/" />

      <section className="packs-content" aria-label="Tienda de sobres">
        <div className="coins-summary">
          <span>TUS MONEDAS</span>
          <strong>{perfil.monedas}</strong>
          <p>GANA MÁS BATEANDO FINALES</p>
        </div>

        <h2 className="packs-heading">SOBRES DISPONIBLES</h2>
        <section className="packs-list" aria-label="Sobres disponibles">
          {packs.map((pack) => (
            <button className="pack-card" type="button" key={pack.id} disabled={perfil.monedas < pack.price} onClick={() => comprar(pack)}>
              <span className={`pack-swatch pack-swatch-${pack.tone}`} aria-hidden="true" />
              <span className="pack-copy">
                <strong>{pack.name}</strong>
                <small>{pack.description}</small>
              </span>
              <span className={pack.price === 500 ? 'pack-price is-expensive' : 'pack-price'}>{pack.price}</span>
            </button>
          ))}
        </section>

        {aviso && <p className="prueba-aviso is-alerta" role="status">{aviso}</p>}
      </section>

      <BottomNav activeTab="inicio" onTabChange={() => {}} />
    </main>
  )
}
