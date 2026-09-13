import { useState } from 'react'
import { Header } from '../components/Header'

export function CommunityPage() {
  const [query, setQuery] = useState('')

  return (
    <>
      <a className="skip-link" href="#community-content">
        Saltar al contenido
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

        <div className="community-layout" id="community-content">
          <aside className="filter-column">
            <h2>Explorar</h2>
            <p>Filtros de comunidad</p>
          </aside>

          <section className="feed">
            <h2>Comunidad</h2>
            <p>Aquí se mostrarán las publicaciones.</p>
          </section>

          <aside>
            <h2>Actividad</h2>
            <p>Ranking, conexiones y notificaciones.</p>
          </aside>
        </div>
      </main>
    </>
  )
}