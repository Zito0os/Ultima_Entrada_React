import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'

const filters = ['TODOS', 'EDITADO', 'ORIGINAL']

const initialPhotos = [
  { id: 1, edited: true },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8, edited: true },
  { id: 9 },
  { id: 10 },
  { id: 11 },
  { id: 12 },
]

export default function Galeria() {
  const navigate = useNavigate()
  const selector = useRef(null)
  const [activeFilter, setActiveFilter] = useState('TODOS')
  const [photos, setPhotos] = useState(initialPhotos)
  const [selectedPhotos, setSelectedPhotos] = useState([])

  const visibles = photos.filter((photo) => activeFilter === 'TODOS'
    || (activeFilter === 'EDITADO' ? photo.edited : !photo.edited))

  const togglePhoto = (photoId) => {
    setSelectedPhotos((currentPhotos) => currentPhotos.includes(photoId)
      ? currentPhotos.filter((id) => id !== photoId)
      : [...currentPhotos, photoId])
  }

  const importar = (event) => {
    const archivos = Array.from(event.target.files || [])
    if (!archivos.length) {
      return
    }
    setPhotos((actuales) => [
      ...archivos.map((archivo, indice) => ({ id: Date.now() + indice, nombre: archivo.name })),
      ...actuales,
    ])
    event.target.value = ''
  }

  return (
    <main className="gallery-shell">
      <PageHeader title="GALERÍA" backTo="/perfil" rightLabel={`${photos.length} FOTOS`} />

      <section className="gallery-content" aria-label="Galería de fotos">
        <div className="gallery-filters" role="tablist" aria-label="Filtrar fotos">
          {filters.map((filter) => (
            <button className={activeFilter === filter ? 'gallery-filter is-active' : 'gallery-filter'} type="button" role="tab" aria-selected={activeFilter === filter} onClick={() => setActiveFilter(filter)} key={filter}>
              {filter}
            </button>
          ))}
        </div>

        <section className="photo-grid" aria-label="Fotos guardadas">
          {visibles.map((photo) => (
            <button className={selectedPhotos.includes(photo.id) ? 'photo-placeholder is-selected' : 'photo-placeholder'} type="button" key={photo.id} onClick={() => togglePhoto(photo.id)} aria-pressed={selectedPhotos.includes(photo.id)} aria-label={`Foto ${photo.id}`}>
              {photo.edited && <span>EDITADA</span>}
            </button>
          ))}
        </section>

        {!visibles.length && <p className="gallery-vacia">No hay fotos con ese filtro.</p>}

        <div className="gallery-actions">
          <input type="file" accept="image/*" multiple ref={selector} onChange={importar} hidden />
          <button className="gallery-action" type="button" onClick={() => selector.current?.click()}>IMPORTAR</button>
          <button className="gallery-action is-principal" type="button" disabled={!selectedPhotos.length} onClick={() => navigate(`/galeria/${selectedPhotos[0]}`)}>
            SELECCIONAR{selectedPhotos.length ? ` (${selectedPhotos.length})` : ''}
          </button>
        </div>
      </section>

      <BottomNav activeTab="perfil" onTabChange={() => {}} />
    </main>
  )
}
