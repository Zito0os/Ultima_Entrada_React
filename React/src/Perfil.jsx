import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from './Navigation'
import PageHeader from './PageHeader'
import Icono from './Icono'
import TrofeoGanado from './TrofeoGanado'

import { TOTAL_TROFEOS, trofeos } from './trofeosData'
import { useJugador } from './almacen/useJugador'
import { useTema } from './useTema'
import { sonar } from './sonidos'

const filtros = [
  { id: 'todos', nombre: 'TODOS' },
  { id: 'trivia', nombre: 'TRIVIA' },
  { id: 'final', nombre: 'FINALES' },
  { id: 'logro', nombre: 'LOGROS' },
]

// Por ahora todos abren su modelo 3D; los no ganados solo se ven en gris en la lista
function TarjetaTrofeo({ trofeo, ganado, onVer }) {
  return (
    <button className={ganado ? 'trophy-card is-unlocked' : 'trophy-card is-locked'} type="button" title={trofeo.pista} onClick={() => onVer(trofeo)}>
      <span className="trophy-mark"><Icono nombre="trofeo" /></span>
      <strong>{trofeo.nombre}</strong>
    </button>
  )
}

function inicialesDe(nombre) {
  const partes = nombre.trim().split(/\s+/).filter(Boolean)
  if (!partes.length) {
    return '?'
  }
  return partes.slice(0, 2).map((parte) => parte[0]).join('').toUpperCase()
}

export default function Perfil() {
  const navigate = useNavigate()
  const { perfil, acciones } = useJugador()
  const { tema, conSonido } = useTema()
  const [filtro, setFiltro] = useState('todos')
  // El trofeo que se esta viendo en 3D
  const [visto, setVisto] = useState(null)

  const ganados = perfil.trofeos.length
  const visibles = trofeos.filter((trofeo) => filtro === 'todos' || trofeo.tipo === filtro)

  return (
    <main className="profile-shell">
      <PageHeader title="MI PERFIL" backTo="/" />

      <section className="profile-content" aria-label="Progreso de trofeos">
        <div className="profile-identity">
          <div className="profile-avatar" aria-hidden="true">
            <span>{inicialesDe(perfil.cuenta.usuario || 'Usuario invitado')}</span>
          </div>
          <strong className="profile-name">{perfil.cuenta.usuario || 'USUARIO INVITADO'}</strong>
        </div>

        {perfil.cuenta.invitado && (
          <button className="gallery-entry cuenta-entry" type="button" onClick={() => navigate('/entrar')}>
            <strong>CUENTA</strong>
            <span className="cuenta-valor">INICIAR SESIÓN</span>
          </button>
        )}

        <button className="gallery-entry" type="button" onClick={() => navigate('/galeria')}>
          <strong>GALERÍA</strong>
          <span className="flecha-avance"><Icono nombre="flecha" /></span>
        </button>
        <button className="gallery-entry album-entry" type="button" onClick={() => navigate('/album')}>
          <strong>ALBUM</strong>
          <span className="flecha-avance"><Icono nombre="flecha" /></span>
        </button>



        <div className="profile-summary">
          <div>
            <span>TROFEOS</span>
            <strong>{ganados}<span>/{TOTAL_TROFEOS}</span></strong>
          </div>
          <div className="streak-summary">
            <span>RACHA</span>
            <strong>{perfil.racha.dias}</strong>
          </div>
          <div className="progress-track" aria-label={`${ganados} de ${TOTAL_TROFEOS} trofeos desbloqueados`}>
            <span style={{ width: `${(ganados / TOTAL_TROFEOS) * 100}%` }} />
          </div>
        </div>

        <div className="profile-filters" role="tablist" aria-label="Filtrar trofeos">
          {filtros.map((item) => (
            <button className={filtro === item.id ? 'profile-filter is-active' : 'profile-filter'} type="button" role="tab" aria-selected={filtro === item.id} onClick={() => setFiltro(item.id)} key={item.id}>
              {item.nombre}
            </button>
          ))}
        </div>

        <section className="trophy-grid" aria-label="Colección de trofeos">
          {visibles.map((trofeo) => (
            <TarjetaTrofeo trofeo={trofeo} ganado={perfil.trofeos.includes(trofeo.id)} onVer={setVisto} key={trofeo.id} />
          ))}
        </section>

        {visto && (
          <div className="modal-backdrop" onClick={() => setVisto(null)} role="presentation">
            <div className="trofeo-visor" onClick={(evento) => evento.stopPropagation()} role="presentation">
              <TrofeoGanado trofeo={visto} kicker={perfil.trofeos.includes(visto.id) ? 'TU COLECCIÓN' : 'AÚN NO LO GANAS'} conSonido={false} onCerrar={() => setVisto(null)} />
            </div>
          </div>
        )}

        {!perfil.cuenta.invitado && (
          <button className="profile-logout" type="button" onClick={() => acciones.cerrarSesion()}>
            CERRAR SESIÓN
          </button>
        )}
        <section className="ajustes-perfil" aria-label="Preferencias">
          <p className="ajustes-titulo">PREFERENCIAS</p>
          <div className="ajustes-fila">
            <button
              className={tema === 'claro' ? 'ajuste-opcion is-active' : 'ajuste-opcion'}
              type="button"
              aria-pressed={tema === 'claro'}
              onClick={() => acciones.marcarPreferencia('tema', 'claro')}
            >MODO CLARO</button>
            <button
              className={tema === 'oscuro' ? 'ajuste-opcion is-active' : 'ajuste-opcion'}
              type="button"
              aria-pressed={tema === 'oscuro'}
              onClick={() => acciones.marcarPreferencia('tema', 'oscuro')}
            >MODO OSCURO</button>
          </div>
          <button
            className={conSonido ? 'ajuste-opcion es-ancho is-active' : 'ajuste-opcion es-ancho'}
            type="button"
            aria-pressed={conSonido}
            onClick={() => { acciones.marcarPreferencia('sonido', !conSonido); if (!conSonido) { sonar('acierto') } }}
          >{conSonido ? 'SONIDO ENCENDIDO' : 'SONIDO APAGADO'}</button>
        </section>

      </section>

      <BottomNav activeTab="perfil" onTabChange={() => {}} />
    </main>
  )
}
