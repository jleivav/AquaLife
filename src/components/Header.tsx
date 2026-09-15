import { currentUser } from '../data/community'
import type { Page } from '../navigation'
import { Avatar } from './Avatar'
import { Icon } from './Icon'

interface HeaderProps {
  activePage?: Page
  query?: string
  onQueryChange?: (value: string) => void
  onHome?: () => void
}

export function Header({ activePage = 'community', query = '', onQueryChange, onHome }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#inicio" aria-label="Aqua Life, inicio">
          <span className="brand-icon"><Icon name="drop" size={25} /></span>
          <span>Aqua<span className="brand-light">Life</span><span className="brand-dot">.</span></span>
        </a>
        <nav className="main-nav" aria-label="Navegación principal">
          <a href="#inicio" className={`nav-link ${activePage === 'home' ? 'active' : ''}`}
            aria-current={activePage === 'home' ? 'page' : undefined}>Inicio</a>
          <a href="#simulacion" className={`nav-link ${activePage === 'simulation' ? 'active' : ''}`}
            aria-current={activePage === 'simulation' ? 'page' : undefined}>Simulación</a>
          <a href="#comunidad" className={`nav-link ${activePage === 'community' ? 'active' : ''}`}
            aria-current={activePage === 'community' ? 'page' : undefined}
            onClick={activePage === 'community' ? onHome : undefined}>Comunidad</a>
        </nav>
        <div className="header-actions">
          {onQueryChange ? (
            <label className="header-search">
              <Icon name="search" size={18} />
              <span className="sr-only">Buscar en la comunidad</span>
              <input type="search" placeholder="Buscar en Aqua Life" value={query} onChange={(event) => onQueryChange(event.target.value)} />
            </label>
          ) : (
            <a className="icon-button" href="#publicaciones" aria-label="Buscar en la comunidad"><Icon name="search" /></a>
          )}
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
