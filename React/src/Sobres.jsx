import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'
import SobreArte from './cartas/SobreArte'
import { describirSobre, probabilidades, resolverSobre, sobres, sortearSobre } from './cartas/sobres'
import { sonar } from './sonidos'
import { useJugador } from './almacen/useJugador'
import './cartas/apertura.css'

export default function Sobres() {
  const navigate = useNavigate()
  const { perfil, acciones } = useJugador()
  const [elegido, setElegido] = useState(sobres[0].id)
  const [aviso, setAviso] = useState('')
  // Un doble toque rapido llega antes de que el saldo nuevo se pinte
  const comprando = useRef(false)

  const sobre = sobres.find((item) => item.id === elegido)
  const faltan = sobre.precio - perfil.monedas

  const comprar = () => {
    if (comprando.current) {
      return
    }
    // Se sortea fuera del guardado: la funcion que actualiza el perfil puede
    // correr dos veces en StrictMode y sacaria cartas distintas
    const resultado = resolverSobre(sortearSobre(sobre), perfil.cartas)
    if (!acciones.gastarMonedas(sobre.precio)) {
      setAviso(`Te faltan ${faltan} monedas para ese sobre.`)
      return
    }
    comprando.current = true
    // En el mismo evento: el almacen junta los tres cambios en una sola escritura
    acciones.agregarCartas(resultado.cartas)
    if (resultado.monedasExtra) {
      acciones.ganarMonedas(resultado.monedasExtra)
    }
    sonar('moneda')
    navigate(`/sobres/${sobre.id}`, { state: { cartas: resultado.cartas, monedasExtra: resultado.monedasExtra } })
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

        <h2 className="packs-heading">ELIGE TU SOBRE</h2>
        <div className="tienda-sobres" role="radiogroup" aria-label="Sobres disponibles">
          {sobres.map((item) => (
            <button
              className={item.id === elegido ? 'tienda-sobre is-elegido' : 'tienda-sobre'}
              type="button"
              role="radio"
              aria-checked={item.id === elegido}
              key={item.id}
              onClick={() => { setElegido(item.id); setAviso('') }}
            >
              <SobreArte sobre={item} className="sobre--mini" />
              <b>{item.precio}</b>
            </button>
          ))}
        </div>

        <div className="tienda-ficha">
          <strong>{sobre.nombre}</strong>
          <small>{describirSobre(sobre)}</small>
          <ul className="tienda-probabilidades">
            {probabilidades(sobre).map((rareza) => (
              <li className={`rareza--${rareza.id}`} key={rareza.id}>{rareza.nombre} <b>{rareza.porcentaje}%</b></li>
            ))}
          </ul>
          <button className="tienda-comprar" type="button" disabled={faltan > 0} onClick={comprar}>
            {faltan > 0 ? `TE FALTAN ${faltan} MONEDAS` : `COMPRAR POR ${sobre.precio}`}
          </button>
        </div>

        <p className="packs-nota">Probabilidad de sacar al menos una carta de cada rareza. Las repetidas se convierten en 15 monedas.</p>
        {aviso && <p className="prueba-aviso is-alerta" role="status">{aviso}</p>}
      </section>

      <BottomNav activeTab="inicio" onTabChange={() => {}} />
    </main>
  )
}
