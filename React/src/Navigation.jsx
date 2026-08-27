import { useNavigate } from 'react-router-dom'

import Icono from './Icono'

const navigation = [
  { id: 'inicio', label: 'INICIO', path: '/' },
  { id: 'equipos', label: 'EQUIPOS', path: '/equipos' },
  { id: 'ar', label: 'AR', path: '/ar' },
  { id: 'historia', label: 'HISTORIA', path: '/historia' },
  { id: 'perfil', label: 'PERFIL', path: '/perfil' },
]

export default function BottomNav({ activeTab, onTabChange }) {
  const navigate = useNavigate()

  const handleNavigation = (item) => {
    if (item.path) {
      navigate(item.path)
      return
    }

    onTabChange(item.id)
  }

  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {navigation.map((item) => (
        <button className={activeTab === item.id ? 'nav-item is-active' : 'nav-item'} type="button" key={item.id} onClick={() => handleNavigation(item)} aria-current={activeTab === item.id ? 'page' : undefined}>
          <span className="nav-icon"><Icono nombre={item.id} /></span><span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
