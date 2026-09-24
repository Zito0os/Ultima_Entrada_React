import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Icono from './Icono'
import BottomNav from './Navigation'
import PageHeader from './PageHeader'
import { useJugador } from './almacen/useJugador'
import { exportarFotos, leerImagen } from './almacen/fotos'

const filtros = ['TODOS', 'EDITADO', 'ORIGINAL']
const ESPERA_ETIQUETA = 450

// Boton redondo que muestra su nombre si se deja presionado. Soltarlo despues
// de ver la etiqueta no dispara la accion.
function BotonFlotante({ icono, etiqueta, onClick, inactivo = false, principal = false }) {
  const temporizador = useRef(null)
  const vioEtiqueta = useRef(false)
  const [abierta, setAbierta] = useState(false)

  const presionar = () => {
    vioEtiqueta.current = false
    temporizador.current = setTimeout(() => {
      vioEtiqueta.current = true
      setAbierta(true)
    }, ESPERA_ETIQUETA)
  }

  const soltar = () => {
    clearTimeout(temporizador.current)
    setAbierta(false)
  }

  const pulsar = () => {
    if (vioEtiqueta.current || inactivo) {
      vioEtiqueta.current = false
      return
    }
    onClick()
  }

  // aria-disabled en vez de disabled: un boton deshabilitado no recibe el toque y no mostraria su nombre
  return (
    <button
      className={['gallery-action', principal && 'is-principal', abierta && 'is-etiqueta'].filter(Boolean).join(' ')}
      type="button"
      aria-label={etiqueta}
      aria-disabled={inactivo}
      onClick={pulsar}
      onPointerDown={presionar}
      onPointerUp={soltar}
      onPointerLeave={soltar}
      onPointerCancel={soltar}
      onContextMenu={(event) => event.preventDefault()}
    >
      <Icono nombre={icono} size={24} />
      <span className="gallery-action__etiqueta" aria-hidden="true">{etiqueta}</span>
    </button>
  )
}

function Miniatura({ usuarioId, foto, elegida, onAlternar }) {
  const [imagen, setImagen] = useState(null)

  useEffect(() => {
    let vivo = true
    leerImagen(usuarioId, foto.id)
      .then((datos) => {
        if (vivo) {
          setImagen(datos)
        }
      })
      .catch(() => {
        // sin imagen queda el cuadro gris
      })
    return () => {
      vivo = false
    }
  }, [usuarioId, foto.id])

  return (
    <button className={elegida ? 'photo-placeholder is-selected' : 'photo-placeholder'} type="button" onClick={() => onAlternar(foto.id)} aria-pressed={elegida} aria-label={foto.nombre}>
      {imagen && <img src={imagen} alt="" />}
      {foto.editada && <span>EDITADA</span>}
      {elegida && <Icono nombre="check" size={26} className="photo-check" />}
    </button>
  )
}

export default function Galeria() {
  const navigate = useNavigate()
  const { perfil, usuarioId, acciones } = useJugador()
  const [filtro, setFiltro] = useState('TODOS')
  const [elegidas, setElegidas] = useState([])
  const [aviso, setAviso] = useState('')

  const fotos = perfil.galeria
  const visibles = fotos.filter((foto) => filtro === 'TODOS'
    || (filtro === 'EDITADO' ? foto.editada : !foto.editada))

  const alternar = (fotoId) => {
    setElegidas((actuales) => actuales.includes(fotoId)
      ? actuales.filter((id) => id !== fotoId)
      : [...actuales, fotoId])
  }

  const exportar = () => {
    setAviso('')
    exportarFotos(usuarioId, fotos.filter((foto) => elegidas.includes(foto.id)))
      .catch(() => setAviso('No se pudo exportar. Inténtalo otra vez.'))
  }

  const borrar = () => {
    elegidas.forEach((fotoId) => acciones.borrarFoto(fotoId))
    setElegidas([])
  }

  return (
    <main className="gallery-shell">
      <PageHeader title="GALERÍA" backTo="/perfil" rightLabel={`${fotos.length} FOTOS`} />

      <section className="gallery-content" aria-label="Galería de fotos">
        <div className="gallery-filters" role="tablist" aria-label="Filtrar fotos">
          {filtros.map((item) => (
            <button className={filtro === item ? 'gallery-filter is-active' : 'gallery-filter'} type="button" role="tab" aria-selected={filtro === item} onClick={() => setFiltro(item)} key={item}>
              {item}
            </button>
          ))}
        </div>

        <section className="photo-grid" aria-label="Fotos guardadas">
          {visibles.map((foto) => (
            <Miniatura usuarioId={usuarioId} foto={foto} elegida={elegidas.includes(foto.id)} onAlternar={alternar} key={foto.id} />
          ))}
        </section>

        {aviso && <p className="gallery-vacia" role="status">{aviso}</p>}
        {!visibles.length && <p className="gallery-vacia">{fotos.length ? 'No hay fotos con ese filtro.' : 'Todavía no guardas fotos. Toma una desde el AR.'}</p>}

        <div className="gallery-actions">
          <BotonFlotante icono="exportar" etiqueta={elegidas.length > 1 ? `EXPORTAR (${elegidas.length})` : 'EXPORTAR AL CELULAR'} inactivo={!elegidas.length} onClick={exportar} />
          <BotonFlotante icono="basura" etiqueta={elegidas.length > 1 ? `BORRAR (${elegidas.length})` : 'BORRAR'} inactivo={!elegidas.length} onClick={borrar} />
          <BotonFlotante icono="lapiz" etiqueta="EDITAR FOTO" inactivo={elegidas.length !== 1} principal onClick={() => navigate(`/galeria/${elegidas[0]}`)} />
        </div>
      </section>

      <BottomNav activeTab="perfil" onTabChange={() => {}} />
    </main>
  )
}
