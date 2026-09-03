import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'
import Icono from './Icono'
import { TROFEOS_TOTAL } from './almacen/esquema'
import { trofeos } from './trofeosData'
import { useJugador } from './almacen/useJugador'

const filtros = [
  { id: 'todos', nombre: 'TODOS' },
  { id: 'trivia', nombre: 'TRIVIA' },
  { id: 'final', nombre: 'FINALES' },
  { id: 'logro', nombre: 'LOGROS' },
]

function TarjetaTrofeo({ trofeo, ganado }) {
  return (
    <article className={ganado ? 'trophy-card is-unlocked' : 'trophy-card is-locked'} title={trofeo.pista}>
      <span className="trophy-mark"><Icono nombre="trofeo" /></span>
      <strong>{trofeo.nombre}</strong>
    </article>
  )
}

export default function Perfil() {
  const navigate = useNavigate()
  const { perfil, acciones } = useJugador()
  const [filtro, setFiltro] = useState('todos')

  const ganados = perfil.trofeos.length
  const visibles = trofeos.filter((trofeo) => filtro === 'todos' || trofeo.tipo === filtro)

  return (
    <main className="profile-shell">
      <PageHeader title="MI PERFIL" backTo="/" />

      <section className="profile-content" aria-label="Progreso de trofeos">
        <button className="gallery-entry cuenta-entry" type="button" onClick={() => navigate(perfil.cuenta.invitado ? '/entrar' : '/perfil')}>
          <strong>CUENTA</strong>
          <span className="cuenta-valor">{perfil.cuenta.usuario || 'INICIAR SESIÓN'}</span>
        </button>

        {!perfil.cuenta.invitado && (
          <button className="gallery-entry" type="button" onClick={() => acciones.cerrarSesion()}>
            <strong>CERRAR SESIÓN</strong>
            <span className="flecha-avance"><Icono nombre="flecha" /></span>
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
            <strong>{ganados}<span>/{TROFEOS_TOTAL}</span></strong>
          </div>
          <div className="streak-summary">
            <span>RACHA</span>
            <strong>{perfil.racha.dias}</strong>
          </div>
          <div className="progress-track" aria-label={`${ganados} de ${TROFEOS_TOTAL} trofeos desbloqueados`}>
            <span style={{ width: `${(ganados / TROFEOS_TOTAL) * 100}%` }} />
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
            <TarjetaTrofeo trofeo={trofeo} ganado={perfil.trofeos.includes(trofeo.id)} key={trofeo.id} />
          ))}
        </section>
      </section>

      <BottomNav activeTab="perfil" onTabChange={() => {}} />
    </main>
  )
}
