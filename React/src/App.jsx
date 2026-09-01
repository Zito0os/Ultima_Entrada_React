import { Suspense, lazy, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import './App.css'
import './pantallas.css'
import AR from './AR'
import Album from './Album'
import AbriendoSobre from './Abriendo_sobre'
import Entrar from './Entrar'
import Escudos from './Escudos'
import EquipoDetalle from './EquipoDetalle'
import Equipos from './Equipos'
import DetalleFinal from './Detalle_Final'
import Finales from './Finales'
import FotoFiltros from './FotoFiltros'
import Galeria from './Galeria'
import JuegoFinal from './JuegoFinal'
import Historia from './Historia'
import HistoriaDetalle from './HistoriaDetalle'
import MejoresJugadas from './MejoresJugadas'
import Icono from './Icono'
import BottomNav from './Navigation'
import PantallaCarga from './PantallaCarga'
import Perfil from './Perfil'
import PageHeader from './PageHeader'
import Registro from './Registro'
import Sobres from './Sobres'
import Tarjetas from './Tarjetas'
import Trivia from './Trivia'
import Resultado from './Resultado'
import Videos from './Videos'

// three.js solo se descarga al entrar a la prueba 3D
const PruebaEscudo = lazy(() => import('./PruebaEscudo'))
const CompilarMarcador = lazy(() => import('./CompilarMarcador'))
const VerEscudoAR = lazy(() => import('./VerEscudoAR'))

const CLAVE_CARGA = 'ue_carga_vista'

function yaSeVioLaCarga() {
  try {
    return sessionStorage.getItem(CLAVE_CARGA) === '1'
  } catch {
    return false
  }
}

function marcarCargaVista() {
  try {
    sessionStorage.setItem(CLAVE_CARGA, '1')
  } catch {
    // sin almacenamiento la carga se vuelve a mostrar, no es un error
  }
}

function HomePage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('inicio')
  const [isChallengeOpen, setIsChallengeOpen] = useState(false)
  const [areRulesOpen, setAreRulesOpen] = useState(false)

  const contentCards = [
    { id: 'trivia', title: 'TRIVIA', subtitle: 'Pon a prueba tus conocimientos', icon: '?', tone: 'green', path: '/trivia' },
    { id: 'sobres', title: 'SOBRES', subtitle: 'Descubre premios sorpresa', icono: 'cartas', tone: 'violet', path: '/sobres' },
    { id: 'videos', title: 'VIDEOS', subtitle: 'Las mejores jugadas de la historia', icon: '▶', tone: 'red', path: '/mejores-jugadas' },
    { id: 'finales', title: 'FINALES', subtitle: 'Batea la última entrada', icon: '◆', tone: 'green', path: '/finales' },
  ]

  return (
    <main className="app-shell">
      <header className="topbar">
        <PageHeader title="INICIO" />

        <section className="daily-challenge" aria-labelledby="challenge-title">
          <p className="eyebrow">RETO DE HOY</p>
          <h2 id="challenge-title">ÚLTIMA<br />ENTRADA</h2>
          <p className="challenge-meta">Serie Mundial 1975 · Juego 6 · Cierre del 9°</p>
          <p className="reward"><strong>1 TROFEO</strong><span>+</span><strong>50 MONEDAS</strong></p>
          <div className="challenge-actions">
            <button className="button button-primary" type="button" onClick={() => setIsChallengeOpen(true)}>JUGAR</button>
            <button className="button button-secondary" type="button" onClick={() => setAreRulesOpen(true)}>REGLAS</button>
          </div>
        </section>
      </header>

      <section className="content-grid" aria-label="Contenido de ÚLTIMA ENTRADA">
        {contentCards.map((card) => (
          <button className={`content-card card-${card.tone}`} type="button" key={card.title} onClick={() => navigate(card.path)}>
            <span className="card-copy"><strong>{card.title}</strong><small>{card.subtitle}</small></span>
            <span className="card-icon" aria-hidden="true">{card.icono ? <Icono nombre={card.icono} /> : card.icon}</span>
          </button>
        ))}
      </section>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {isChallengeOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsChallengeOpen(false)}>
          <section className="challenge-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(event) => event.stopPropagation()}>
            <button className="close-button" type="button" aria-label="Cerrar reto" onClick={() => setIsChallengeOpen(false)}>×</button>
            <span className="modal-kicker">RETO DE HOY</span>
            <h2 id="modal-title">¿LISTO PARA<br />LA ÚLTIMA ENTRADA?</h2>
            <p>Serie Mundial 1975, cierre del noveno con dos outs. Si resuelves la jugada te llevas el trofeo y cincuenta monedas.</p>
            <button className="button button-primary modal-action" type="button" onClick={() => navigate('/finales/1975/jugar')}>COMENZAR</button>
          </section>
        </div>
      )}

      {areRulesOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setAreRulesOpen(false)}>
          <section className="challenge-modal rules-modal" role="dialog" aria-modal="true" aria-labelledby="rules-title" onClick={(event) => event.stopPropagation()}>
            <button className="close-button" type="button" aria-label="Cerrar reglas" onClick={() => setAreRulesOpen(false)}>×</button>
            <span className="modal-kicker">REGLAS</span>
            <h2 id="rules-title">ÚLTIMA<br />ENTRADA</h2>
            <ol className="rules-list">
              <li>Tomas el último turno al bate de una Serie Mundial histórica.</li>
              <li>La barra de tiempo decide la calidad del contacto: detenla en el centro.</li>
              <li>Tres strikes o tres outs y el turno se termina.</li>
              <li>Cada turno ganado son diez monedas; ganar la final son cincuenta y un trofeo.</li>
              <li>Los trofeos abren los escenarios que siguen bloqueados.</li>
            </ol>
            <button className="button button-primary modal-action" type="button" onClick={() => setAreRulesOpen(false)}>ENTENDIDO</button>
          </section>
        </div>
      )}
    </main>
  )
}

function AppRoutes() {
  const location = useLocation()

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/entrar" element={<Entrar />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/ar" element={<AR />} />
      <Route path="/ar/compilar" element={<Suspense fallback={<p className="prueba-cargando">Cargando el compilador...</p>}><CompilarMarcador /></Suspense>} />
      <Route path="/ar/prueba" element={<Suspense fallback={<p className="prueba-cargando">Cargando el motor 3D...</p>}><PruebaEscudo /></Suspense>} />
      <Route path="/ar/escudos" element={<Escudos />} />
      <Route path="/ar/ver/:escudoId" element={<Suspense fallback={<p className="prueba-cargando">Encendiendo la camara...</p>}><VerEscudoAR /></Suspense>} />
      <Route path="/ar/tarjetas" element={<Tarjetas />} />
      <Route path="/ar/tarjetas/anclado" element={<Tarjetas />} />
      <Route path="/album" element={<Album />} />
      <Route path="/equipos" element={<Equipos />} />
      <Route path="/equipos/:teamId" element={<EquipoDetalle />} />
      <Route path="/historia" element={<Historia />} />
      <Route path="/historia/:eventId" element={<HistoriaDetalle />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/galeria" element={<Galeria />} />
      <Route path="/galeria/:fotoId" element={<FotoFiltros />} />
      <Route path="/sobres" element={<Sobres />} />
      <Route path="/sobres/:packId" element={<AbriendoSobre />} />
      <Route path="/finales" element={<Finales />} />
      <Route path="/finales/:finalId" element={<DetalleFinal />} />
      <Route path="/finales/:finalId/jugar" element={<JuegoFinal />} />
      <Route path="/finales/:finalId/resultado" element={<Resultado />} />
      <Route path="/trivia" element={<Trivia />} />
      <Route path="/trivia/:mode" element={<Trivia />} />
      <Route path="/mejores-jugadas" element={<MejoresJugadas />} />
      <Route path="/mejores-jugadas/:playId" element={<Videos />} />
      <Route path="/videos/:eventId" element={<Videos />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="*" element={<Navigate to={location.pathname.startsWith('/equipos') ? '/equipos' : '/'} replace />} />
    </Routes>
  )
}

function App() {
  const [cargando, setCargando] = useState(() => !yaSeVioLaCarga())

  const terminarCarga = () => {
    marcarCargaVista()
    setCargando(false)
  }

  if (cargando) {
    return <PantallaCarga onDone={terminarCarga} />
  }

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
