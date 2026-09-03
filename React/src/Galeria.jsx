import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'
import { useJugador } from './almacen/useJugador'

const filtros = ['TODOS', 'EDITADO', 'ORIGINAL']

export default function Galeria() {
  const navigate = useNavigate()
  const selector = useRef(null)
  const { perfil, acciones } = useJugador()
  const [filtro, setFiltro] = useState('TODOS')
  const [elegidas, setElegidas] = useState([])

  const fotos = perfil.galeria
  const visibles = fotos.filter((foto) => filtro === 'TODOS'
    || (filtro === 'EDITADO' ? foto.editada : !foto.editada))

  const alternar = (fotoId) => {
    setElegidas((actuales) => actuales.includes(fotoId)
      ? actuales.filter((id) => id !== fotoId)
      : [...actuales, fotoId])
  }

  // Solo se guardan los datos de la foto. El archivo se sube a Storage cuando
  // entre la base de datos: en localStorage no cabe.
  const importar = (event) => {
    const archivos = Array.from(event.target.files || [])
    if (!archivos.length) {
      return
    }
    acciones.agregarFotos(archivos.map((archivo, indice) => ({
      id: `foto-${Date.now()}-${indice}`,
      nombre: archivo.name,
      editada: false,
      creada: new Date().toISOString(),
    })))
    event.target.value = ''
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
            <button className={elegidas.includes(foto.id) ? 'photo-placeholder is-selected' : 'photo-placeholder'} type="button" key={foto.id} onClick={() => alternar(foto.id)} aria-pressed={elegidas.includes(foto.id)} aria-label={foto.nombre}>
              {foto.editada && <span>EDITADA</span>}
            </button>
          ))}
        </section>

        {!visibles.length && <p className="gallery-vacia">{fotos.length ? 'No hay fotos con ese filtro.' : 'Todavía no guardas fotos. Importa una o toma una desde el AR.'}</p>}

        <div className="gallery-actions">
          <input type="file" accept="image/*" multiple ref={selector} onChange={importar} hidden />
          <button className="gallery-action" type="button" onClick={() => selector.current?.click()}>IMPORTAR</button>
          <button className="gallery-action" type="button" disabled={!elegidas.length} onClick={borrar}>BORRAR</button>
          <button className="gallery-action is-principal" type="button" disabled={!elegidas.length} onClick={() => navigate(`/galeria/${elegidas[0]}`)}>
            EDITAR{elegidas.length ? ` (${elegidas.length})` : ''}
          </button>
        </div>
      </section>

      <BottomNav activeTab="perfil" onTabChange={() => {}} />
    </main>
  )
}
