import { useNavigate } from 'react-router-dom'

import BottomNav from './Navigation'
import Icono from './Icono'
import PageHeader from './PageHeader'
import { escudos } from './escudosData'

// Se elige el equipo antes de encender la camara: asi solo se carga su archivo
// de marcadores y el rastreo compara contra tres o cuatro imagenes, no contra quince.
export default function Escudos() {
  const navigate = useNavigate()

  return (
    <main className="ar-shell">
      <PageHeader title="ESCUDOS" backTo="/ar" />

      <section className="ar-selector-content" aria-label="Elegir equipo para escanear">
        <p className="ar-selector-kicker">¿QUÉ ESCUDO VAS A ESCANEAR?</p>

        <div className="escudo-lista">
          {escudos.map((escudo) => (
            <button className="escudo-opcion" type="button" onClick={() => navigate(`/ar/ver/${escudo.id}`)} key={escudo.id}>
              <img src={`${import.meta.env.BASE_URL}${escudo.svg}`} alt="" aria-hidden="true" />
              <strong>{escudo.nombre}</strong>
              <span className="flecha-avance"><Icono nombre="flecha" /></span>
            </button>
          ))}
        </div>

        <p className="ar-selector-nota">
          Apunta la cámara al escudo impreso. El modelo aparece encima girando.
        </p>
        <button className="ar-selector-prueba" type="button" onClick={() => navigate('/ar/prueba')}>
          VER LOS MODELOS SIN CÁMARA
        </button>
      </section>

      <BottomNav activeTab="ar" onTabChange={() => {}} />
    </main>
  )
}
