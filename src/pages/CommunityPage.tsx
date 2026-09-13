import { useState } from 'react'
import { Header } from '../components/Header'
import { PostCard } from '../components/PostCard'
import { initialPosts } from '../data/community'

export function CommunityPage() {
  const [query, setQuery] = useState('')

  return (
    <>
      <a className="skip-link" href="#publicaciones">
        Saltar a las publicaciones
      </a>

      <Header
        query={query}
        onQueryChange={setQuery}
        onHome={() => setQuery('')}
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

        <div className="community-layout">
          <aside className="filter-column">
            <h2>Explorar</h2>
            <p>Los filtros se incorporarán próximamente.</p>
          </aside>

          <section
            className="feed"
            id="publicaciones"
            aria-label="Publicaciones de la comunidad"
          >
            <div className="feed-heading">
              <h2>
                En la comunidad
                <span>{initialPosts.length}</span>
              </h2>
            </div>

            {initialPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </section>

          <aside>
            <h2>Actividad</h2>
            <p>Ranking, conexiones y notificaciones próximamente.</p>
          </aside>
        </div>
      </main>
    </>
  )
}