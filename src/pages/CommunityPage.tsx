import { useState } from 'react'
import { Header } from '../components/Header'
import { FilterSidebar } from '../components/FilterSidebar'
import { PostComposer } from '../components/PostComposer'
import { PostCard } from '../components/PostCard'
import { CommunitySidebar } from '../components/CommunitySidebar'
import { Icon } from '../components/Icon'
import { currentUser, initialPosts } from '../data/community'
import type { Category, ContentType, Post, SortOrder } from '../types/community'

const typeCategories: Record<ContentType, Category> = {
  Pregunta: 'care', Experiencia: 'general', Resultado: 'results', Guía: 'guides',
}

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

export function CommunityPage() {
  // El estado vive en esta pantalla; no hay servidor ni persistencia todavía.
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [category, setCategory] = useState<Category>('general')
  const [types, setTypes] = useState<ContentType[]>([])
  const [tag, setTag] = useState('')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortOrder>('recent')
  const [savedOnly, setSavedOnly] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [notice, setNotice] = useState('')

  const filteredPosts = posts.filter((post) =>
    (category === 'general' || post.category === category) &&
    (types.length === 0 || types.includes(post.type)) &&
    (!tag || post.tags.includes(tag)) &&
    (!savedOnly || post.saved) &&
    normalize(`${post.author.name} ${post.text} ${post.tags.join(' ')} ${post.type}`).includes(normalize(query.trim())),
  ).sort((a, b) => sort === 'popular' ? b.likes - a.likes : Date.parse(b.date) - Date.parse(a.date))

  function resetFilters() {
    setCategory('general')
    setTypes([])
    setTag('')
    setQuery('')
    setSavedOnly(false)
    setSort('recent')
  }

  function publishPost(text: string, type: ContentType, image?: string) {
    const extractedTags = [...text.matchAll(/#([\p{L}\p{N}_]+)/gu)].map((match) => match[1])
    const newPost: Post = {
      id: crypto.randomUUID(),
      author: currentUser,
      date: new Date().toISOString(),
      category: typeCategories[type],
      type, text, image,
      tags: [...new Set(extractedTags)],
      likes: 0, liked: false, saved: false, comments: [],
    }
    setPosts((previous) => [newPost, ...previous])
    resetFilters()
    setNotice('Tu publicación se agregó a esta demostración. Los cambios se reinician al recargar.')
  }

  function updatePost(id: string, update: (post: Post) => Post) {
    setPosts((previous) => previous.map((post) => post.id === id ? update(post) : post))
  }

  function toggleType(value: ContentType) {
    setTypes((previous) => previous.includes(value) ? previous.filter((item) => item !== value) : [...previous, value])
  }

  function toggleSaved() {
    const next = !savedOnly
    resetFilters()
    setSavedOnly(next)
  }

  function addComment(postId: string, text: string) {
    updatePost(postId, (post) => ({
      ...post,
      comments: [...post.comments, { id: crypto.randomUUID(), author: currentUser.name, text }],
    }))
    setNotice('Comentario agregado a esta demostración.')
  }

  return (
    <>
      <a className="skip-link" href="#publicaciones">Saltar a las publicaciones</a>
      <Header query={query} onQueryChange={setQuery} onHome={resetFilters} />
      <main className="page-shell" id="inicio">
        <div className="page-heading">
          <div>
            <div className="welcome-label"><span />UN PEQUEÑO ECOSISTEMA, UNA GRAN COMUNIDAD</div>
            <h1>Bienvenido a tu comunidad<span>.</span></h1>
            <p>Comparte lo que descubres. Aprende de otras experiencias.</p>
          </div>
          <span className="demo-badge"><span />Vista de demostración</span>
        </div>
        <button className="mobile-filter-toggle secondary-button" aria-expanded={filtersOpen}
          aria-controls="community-filters" onClick={() => setFiltersOpen(!filtersOpen)}>
          <Icon name="filter" size={18} />{filtersOpen ? 'Ocultar filtros' : 'Explorar y filtrar'}
          <Icon name={filtersOpen ? 'close' : 'search'} size={17} />
        </button>
        <div className="community-layout">
          <div id="community-filters" className={`filter-column ${filtersOpen ? 'filters-open' : ''}`}>
            <FilterSidebar category={category} types={types} tag={tag} savedOnly={savedOnly} query={query}
              onCategoryChange={(value) => { setCategory(value); setSavedOnly(false) }}
              onTypeChange={toggleType} onTagChange={setTag} onSavedChange={toggleSaved}
              onQueryChange={setQuery} onReset={resetFilters} />
          </div>
          <section className="feed" id="publicaciones" aria-label="Publicaciones de la comunidad">
            <PostComposer onPublish={publishPost} />
            <p className="publish-notice" role="status">{notice}</p>
            <div className="feed-heading">
              <h2>{savedOnly ? 'Mis guardados' : 'En la comunidad'}<span>{filteredPosts.length}</span></h2>
              <label className="sort-control">
                <span>Ordenar por</span>
                <select aria-label="Ordenar publicaciones" value={sort} onChange={(event) => setSort(event.target.value as SortOrder)}>
                  <option value="recent">Más recientes</option><option value="popular">Más populares</option>
                </select>
              </label>
            </div>
            {(query || tag || category !== 'general' || types.length > 0) && (
              <div className="active-filters">
                <span>{tag ? `#${tag} · ` : ''}{query ? `“${query}” · ` : ''}{filteredPosts.length} publicaciones encontradas</span>
                <button onClick={resetFilters}>Limpiar<Icon name="close" size={13} /></button>
              </div>
            )}
            <div className="post-list">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post}
                  onLike={() => updatePost(post.id, (item) => ({ ...item, liked: !item.liked, likes: item.likes + (item.liked ? -1 : 1) }))}
                  onSave={() => updatePost(post.id, (item) => ({ ...item, saved: !item.saved }))}
                  onComment={(text) => addComment(post.id, text)} onTagChange={setTag} />
              ))}
            </div>
            {filteredPosts.length === 0 && (
              <div className="card empty-state">
                <Icon name={savedOnly ? 'bookmark' : 'search'} size={32} />
                <h3>{savedOnly ? 'Tu colección empieza aquí' : 'No encontramos publicaciones'}</h3>
                <p>{savedOnly ? 'Guarda una publicación para volver a encontrarla en este espacio.' : 'Prueba otra búsqueda o cambia los filtros para seguir explorando.'}</p>
                <button className="secondary-button" onClick={resetFilters}>Ver todas las publicaciones<Icon name="arrow" size={16} /></button>
              </div>
            )}
            <p className="feed-end"><Icon name="drop" size={16} />Estás al día. Siempre hay algo nuevo por aprender.</p>
          </section>
          <CommunitySidebar />
        </div>
      </main>
    </>
  )
}
