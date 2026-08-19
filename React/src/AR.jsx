import { useState } from 'react'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'

const regions = ['ESTE', 'CENTRAL', 'OESTE']

export default function AR() {
  const [activeRegion, setActiveRegion] = useState('ESTE')

  return (
    <main className="ar-shell">
      <PageHeader title="AR" backTo="/" />

      <section className="ar-content" aria-label="Escáner de realidad aumentada">
        <div className="scan-frame" aria-hidden="true">
          <span className="scan-corner corner-top-left" />
          <span className="scan-corner corner-top-right" />
          <span className="scan-corner corner-bottom-left" />
          <span className="scan-corner corner-bottom-right" />
          <span className="scan-center" />
        </div>

        <h1>BUSCANDO ESCUDO...</h1>
        <div className="ar-regions" aria-label="Seleccionar región">
          {regions.map((region) => (
            <button className={activeRegion === region ? 'ar-region is-active' : 'ar-region'} type="button" onClick={() => setActiveRegion(region)} key={region}>
              {region}
            </button>
          ))}
        </div>

        <button className="camera-button" type="button" aria-label="Activar cámara">
          <span className="camera-icon" aria-hidden="true">▣</span>
        </button>
      </section>

      <BottomNav activeTab="ar" onTabChange={() => {}} />
    </main>
  )
}
