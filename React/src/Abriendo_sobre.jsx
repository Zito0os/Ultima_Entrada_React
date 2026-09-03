import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'
import { cartaAlAzar } from './cartasData'
import { packs } from './packsData'
import { rutaEscudo } from './escudosData'
import { useJugador } from './almacen/useJugador'

// Cuantas cartas trae cada sobre y cual es la rareza que tiene garantizada
const contenido = {
  bronze: { cantidad: 3, garantiza: null },
  silver: { cantidad: 5, garantiza: 'especial' },
  gold: { cantidad: 5, garantiza: 'holo' },
}

function abrir(packId) {
  const { cantidad, garantiza } = contenido[packId] || contenido.bronze
  const sacadas = Array.from({ length: cantidad }, () => cartaAlAzar())
  if (garantiza) {
    sacadas[cantidad - 1] = cartaAlAzar(garantiza)
  }
  return sacadas
}

export default function AbriendoSobre() {
  const { packId } = useParams()
  const navigate = useNavigate()
  const { perfil, acciones } = useJugador()
  const pack = packs.find((item) => item.id === packId)

  const [sacadas] = useState(() => (pack ? abrir(pack.id) : []))
  const [indice, setIndice] = useState(0)
  const guardadas = useRef(false)
  // El perfil de antes de abrir, para saber cuales salen como nuevas
  const [antes] = useState(() => perfil.cartas)

  useEffect(() => {
    if (!sacadas.length || guardadas.current) {
      return
    }
    guardadas.current = true
    acciones.agregarCartas(sacadas)
  }, [sacadas, acciones])

  if (!pack) {
    return <Navigate to="/sobres" replace />
  }

  const carta = sacadas[indice]
  const nueva = !antes[carta.id]

  return (
    <main className="opening-pack-shell">
      <PageHeader title="" backTo="/sobres" />

      <section className="opening-pack-content" aria-label={`Abriendo ${pack.name}`}>
        <div className="card-progress">
          <strong>CARTA&nbsp; {indice + 1} DE {sacadas.length}</strong>
          <div>{sacadas.map((_, numero) => <span className={numero <= indice ? 'is-hecha' : ''} key={numero} />)}</div>
        </div>

        <button className={`opening-card opening-card-${pack.tone}`} type="button" aria-label={carta.nombre}>
          <img src={rutaEscudo(carta.equipo)} alt="" aria-hidden="true" />
          <strong>{carta.nombre}</strong>
          <small>{carta.rarezaNombre}</small>
        </button>

        <div className="card-rarity">
          <strong>{carta.rarezaNombre}</strong>
          <span>{nueva ? 'NUEVA' : 'REPETIDA'}</span>
        </div>

        {indice + 1 < sacadas.length ? (
          <button className="next-card-button" type="button" onClick={() => setIndice((actual) => actual + 1)}>
            SIGUIENTE CARTA
          </button>
        ) : (
          <button className="next-card-button" type="button" onClick={() => navigate('/album')}>
            VER MI ÁLBUM
          </button>
        )}
        <button className="view-card-ar-button" type="button" onClick={() => navigate('/ar/tarjetas')}>
          VER EN AR
        </button>
      </section>

      <BottomNav activeTab="inicio" onTabChange={() => {}} />
    </main>
  )
}
