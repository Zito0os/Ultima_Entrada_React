import { useState } from 'react'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'

const filters = ['TODOS', 'EDITADO', 'ORIGINAL']

const photos = [
  { id: 1, label: 'EDITADA' },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8, label: 'EDITADA' },
  { id: 9 },
  { id: 10 },
  { id: 11 },
  { id: 12 },
]

export default function Galeria() {
  const [activeFilter, setActiveFilter] = useState('TODOS')
  const [selectedPhotos, setSelectedPhotos] = useState([])

  const togglePhoto = (photoId) => {
    setSelectedPhotos((currentPhotos) => currentPhotos.includes(photoId)
      ? currentPhotos.filter((id) => id !== photoId)
      : [...currentPhotos, photoId])
  }

  return (
    <main className="gallery-shell">
      <PageHeader title="GALERÍA" backTo="/perfil" rightLabel="18 FOTOS" />

      <section className="gallery-content" aria-label="Galería de fotos">
        <div className="gallery-filters" role="tablist" aria-label="Filtrar fotos">
          {filters.map((filter) => (
            <button className={activeFilter === filter ? 'gallery-filter is-active' : 'gallery-filter'} type="button" role="tab" aria-selected={activeFilter === filter} onClick={() => setActiveFilter(filter)} key={filter}>
              {filter}
            </button>
          ))}
        </div>

        <section className="photo-grid" aria-label="Fotos guardadas">
          {photos.map((photo) => (
            <button className={selectedPhotos.includes(photo.id) ? 'photo-placeholder is-selected' : 'photo-placeholder'} type="button" key={photo.id} onClick={() => togglePhoto(photo.id)} aria-label={`Foto ${photo.id}`}>
              {photo.label && <span>{photo.label}</span>}
            </button>
          ))}
        </section>

        <div className="gallery-actions">
          <button className="gallery-action" type="button">IMPORTAR</button>
          <button className="gallery-action" type="button">SELECCIONAR{selectedPhotos.length ? ` (${selectedPhotos.length})` : ''}</button>
        </div>
      </section>

      <BottomNav activeTab="perfil" onTabChange={() => {}} />
    </main>
  )
}
