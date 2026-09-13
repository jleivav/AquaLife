import { categories, contentTypes, popularTags } from '../data/community'
import type { Category, ContentType } from '../types/community'
import { Icon } from './Icon'

interface FilterSidebarProps {
  category: Category
  types: ContentType[]
  tag: string
  savedOnly: boolean
  query: string
  onCategoryChange: (value: Category) => void
  onTypeChange: (value: ContentType) => void
  onTagChange: (value: string) => void
  onSavedChange: () => void
  onQueryChange: (value: string) => void
  onReset: () => void
}

const categoryIcons = { general: 'message', simulation: 'flask', care: 'leaf', guides: 'book', results: 'chart' } as const

export function FilterSidebar(props: FilterSidebarProps) {
  return (
    <aside className="filter-sidebar" aria-label="Explorar y filtrar publicaciones">
      <div className="card filters-card">
        <h2 className="eyebrow">EXPLORAR</h2>
        <label className="sidebar-search">
          <Icon name="search" size={17} />
          <span className="sr-only">Buscar publicaciones</span>
          <input type="search" placeholder="Buscar publicaciones" value={props.query} onChange={(event) => props.onQueryChange(event.target.value)} />
        </label>
        <nav className="category-list" aria-label="Categorías">
          {categories.map((item) => (
            <button key={item.id}
              className={`category-button ${props.category === item.id && !props.savedOnly ? 'selected' : ''}`}
              aria-pressed={props.category === item.id && !props.savedOnly}
              onClick={() => props.onCategoryChange(item.id)}>
              <Icon name={categoryIcons[item.id]} />{item.label}
              {props.category === item.id && !props.savedOnly && <span className="selected-dot" />}
            </button>
          ))}
        </nav>
        <div className="filter-divider" />
        <fieldset className="type-filters">
          <legend>TIPO DE CONTENIDO</legend>
          {contentTypes.map((type) => (
            <label key={type}>
              <input type="checkbox" checked={props.types.includes(type)} onChange={() => props.onTypeChange(type)} />{type}
            </label>
          ))}
        </fieldset>
        <div className="filter-divider" />
        <h3 className="eyebrow">ETIQUETAS POPULARES</h3>
        <div className="filter-tags">
          {popularTags.map((tag) => (
            <button key={tag} className={`tag ${props.tag === tag ? 'tag--active' : ''}`}
              aria-pressed={props.tag === tag} onClick={() => props.onTagChange(props.tag === tag ? '' : tag)}>
              #{tag}
            </button>
          ))}
        </div>
        <div className="filter-divider" />
        <button className={`category-button ${props.savedOnly ? 'selected' : ''}`} aria-pressed={props.savedOnly} onClick={props.onSavedChange}>
          <Icon name="bookmark" />Mis guardados
        </button>
        <button className="reset-filters" onClick={props.onReset}>Restablecer filtros</button>
      </div>
      <div className="community-note">
        <span className="note-icon"><Icon name="leaf" size={23} /></span>
        <h3>Crezcamos juntos</h3>
        <p>Cada experiencia compartida ayuda a nuestra comunidad a aprender.</p>
        <span>A tu ritmo, gota a gota.</span>
      </div>
    </aside>
  )
}
