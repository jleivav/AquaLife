import { useState } from 'react'
import { Header } from '../components/Header'
import { FilterSidebar } from '../components/FilterSidebar'
import { PostComposer } from '../components/PostComposer'
import { PostCard } from '../components/PostCard'
import { Icon } from '../components/Icon'
import { currentUser, initialPosts } from '../data/community'
import type {
  Category,
  ContentType,
  Post,
  SortOrder,
} from '../types/community'

const typeCategories: Record<ContentType, Category> = {
  Pregunta: 'care',
  Experiencia: 'general',
  Resultado: 'results',
  Guía: 'guides',
}

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

export function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [category, setCategory] = useState<Category>('general')
  const [types, setTypes] = useState<ContentType[]>([])
  const [tag, setTag] = useState('')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortOrder>('recent')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [notice, setNotice] = useState('')

  const filteredPosts = posts
    .filter(
      (post) =>
        (category === 'general' || post.category === category) &&
        (types.length === 0 || types.includes(post.type)) &&
        (!tag || post.tags.includes(tag)) &&
        normalize(
          `${post.author.name} ${post.text} ${post.tags.join(' ')} ${post.type}`,
        ).includes(normalize(query.trim())),
    )
    .sort((a, b) =>
      sort === 'popular'
        ? b.likes - a.likes
        : Date.parse(b.date) - Date.parse(a.date),
    )

  function resetFilters() {
    setCategory('general')
    setTypes([])
    setTag('')
    setQuery('')
    setSort('recent')
  }

  function toggleType(value: ContentType) {
    setTypes((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value],
    )
  }

  function publishPost(
    text: string,
    type: ContentType,
    image?: string,
  ) {
    const extractedTags = [
      ...text.matchAll(/#([\p{L}\p{N}_]+)/gu),
    ].map((match) => match[1])

    const newPost: Post = {
      id: crypto.randomUUID(),
      author: currentUser,
      date: new Date().toISOString(),
      category: typeCategories[type],
      type,
      text,
      image,
      tags: [...new Set(extractedTags)],
      likes: 0,
      liked: false,
      saved: false,
      comments: [],
    }

    setPosts((previous) => [newPost, ...previous])
    resetFilters()

    setNotice(
      'Tu publicación se agregó a esta demostración. Los cambios se reinician al recargar.',
    )
  }

  return (
    <>
      <a className="skip-link" href="#publicaciones">
        Saltar a las publicaciones
      </a>

      <Header
        query={query}
        onQueryChange={setQuery}
        onHome={resetFilters}
      />

      <main className="page-shell" id="inicio">
        <div className="page-heading">
          <div>
            <div className="welcome-label">
              <span />
              UN PEQUEÑO ECOSISTEMA, UNA GRAN COMUNIDAD
            </div>

            <h1>
              Bienvenido a tu comunidad<span>.</span>
            </h1>

            <p>
              Comparte lo que descubres. Aprende de otras experiencias.
            </p>
          </div>

          <span className="demo-badge">
            <span />
            Vista de demostración
          </span>
        </div>

        <button
          className="mobile-filter-toggle secondary-button"
          aria-expanded={filtersOpen}
          aria-controls="community-filters"
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          <Icon name="filter" size={18} />

          {filtersOpen ? 'Ocultar filtros' : 'Explorar y filtrar'}

          <Icon
            name={filtersOpen ? 'close' : 'search'}
            size={17}
          />
        </button>

        <div className="community-layout">
          <div
            id="community-filters"
            className={`filter-column ${
              filtersOpen ? 'filters-open' : ''
            }`}
          >
            <FilterSidebar
              category={category}
              types={types}
              tag={tag}
              query={query}
              onCategoryChange={setCategory}
              onTypeChange={toggleType}
              onTagChange={setTag}
              onQueryChange={setQuery}
              onReset={resetFilters}
            />
          </div>

          <section
            className="feed"
            id="publicaciones"
            aria-label="Publicaciones de la comunidad"
          >
            <PostComposer onPublish={publishPost} />

            <p className="publish-notice" role="status">
              {notice}
            </p>

            <div className="feed-heading">
              <h2>
                En la comunidad
                <span>{filteredPosts.length}</span>
              </h2>

              <label className="sort-control">
                <span>Ordenar por</span>

                <select
                  aria-label="Ordenar publicaciones"
                  value={sort}
                  onChange={(event) =>
                    setSort(event.target.value as SortOrder)
                  }
                >
                  <option value="recent">Más recientes</option>
                  <option value="popular">Más populares</option>
                </select>
              </label>
            </div>

            {(query ||
              tag ||
              category !== 'general' ||
              types.length > 0) && (
              <div className="active-filters">
                <span>Filtros activos</span>

                <button onClick={resetFilters}>
                  Limpiar filtros
                </button>
              </div>
            )}

            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="card empty-state">
                <Icon name="search" size={24} />
                <h3>No encontramos publicaciones</h3>
                <p>
                  Prueba cambiando o restableciendo los filtros.
                </p>
              </div>
            )}
          </section>

          <aside>
            <h2>Actividad</h2>
            <p>
              Ranking, conexiones y notificaciones próximamente.
            </p>
          </aside>
        </div>
      </main>
    </>
  )
}