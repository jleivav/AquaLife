import { currentUser } from '../data/community'
import { Avatar } from './Avatar'
import { Icon } from './Icon'

interface HeaderProps {
  query: string
  onQueryChange: (value: string) => void
  onHome: () => void
}

export function Header({ query, onQueryChange, onHome }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#inicio" onClick={onHome} aria-label="Aqua Life, inicio">
          <span className="brand-icon"><Icon name="drop" size={25} /></span>
          <span>Aqua<span className="brand-light">Life</span><span className="brand-dot">.</span></span>
        </a>
        <nav className="main-nav" aria-label="Navegación principal">
          <a href="#inicio" className="nav-link active" aria-current="page" onClick={onHome}>Inicio</a>
          <button className="nav-link" disabled title="El simulador estará disponible en una próxima etapa">
            Simulación <span className="soon">Pronto</span>
          </button>
          <a href="#publicaciones" className="nav-link">Comunidad</a>
        </nav>
        <div className="header-actions">
          <label className="header-search">
            <Icon name="search" size={18} />
            <span className="sr-only">Buscar en la comunidad</span>
            <input type="search" placeholder="Buscar en Aqua Life" value={query} onChange={(event) => onQueryChange(event.target.value)} />
          </label>
          <a className="icon-button ranking-shortcut" href="#ranking" aria-label="Ver ranking"><Icon name="trophy" /></a>
          <a className="icon-button notification-shortcut" href="#notificaciones" aria-label="Ver notificaciones">
            <Icon name="bell" />
          </a>
          <span className="header-profile" title={`Perfil de demostración: ${currentUser.name}`}>
            <span className="sr-only">Perfil de demostración: {currentUser.name}</span>
            <Avatar member={currentUser} small />
          </span>
        </div>
      </div>
    </header>
  )
}
