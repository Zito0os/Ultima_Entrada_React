import { useNavigate } from 'react-router-dom'

const navigation = [
  { id: 'inicio', label: 'INICIO', icon: '⌂', path: '/' },
  { id: 'equipos', label: 'EQUIPOS', icon: '♟', path: '/equipos' },
  { id: 'ar', label: 'AR', icon: '◇', path: '/ar' },
  { id: 'historia', label: 'HISTORIA', icon: '▤', path: '/historia' },
  { id: 'perfil', label: 'PERFIL', icon: '●', path: '/perfil' },
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
          <span className="nav-icon" aria-hidden="true">{item.icon}</span><span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
