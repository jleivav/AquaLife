import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Header } from '../components/Header'
import { Comments } from '../modules/Comments'
import { Notices } from '../modules/Notices'
import { Fish } from '../modules/Fish'
import { Ranking } from '../modules/Ranking'
import { ApiError, createPublication, listPublications, restoreSession, signIn, signOut } from '../api'
import type { Publication } from '../api'

export function CommunityPage() {
  const [session, setSession] = useState<'checking' | 'signed-in' | 'signed-out'>('checking')
  const [openPost, setOpenPost] = useState<number>()
  const [posts, setPosts] = useState<Publication[]>([])
  const [search, setSearch] = useState({ term: '', offset: 0 })
  const [total, setTotal] = useState(0)
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let active = true
    restoreSession().then(() => {
      if (active) setSession('signed-in')
    }, (failure: unknown) => {
      if (!active) return
      setSession('signed-out')
      if (!(failure instanceof ApiError) || failure.status !== 401) {
        setError('No pudimos restaurar la sesión. Intenta iniciar sesión.')
      }
    })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (session !== 'signed-in') return
    const controller = new AbortController()
    listPublications(controller.signal, search.term, search.offset).then(({ resultados, total: count }) => {
      if (!controller.signal.aborted) {
        setTotal(count)
        setPosts(resultados)
        setLoading(false)
      }
    }, (failure: unknown) => {
      if (controller.signal.aborted) return
      if (failure instanceof ApiError && failure.status === 401) setSession('signed-out')
      setError('No pudimos cargar las publicaciones.')
      setLoading(false)
    })
    return () => controller.abort()
  }, [session, search])

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    setBusy(true)
    setError('')
    try {
      await signIn(String(values.get('username')), String(values.get('password')))
      setLoading(true)
      setSession('signed-in')
    } catch (failure) {
      setError(failure instanceof ApiError && failure.status === 401
        ? 'Usuario o contraseña incorrectos.'
        : 'No pudimos iniciar sesión. Intenta nuevamente.')
    } finally {
      setBusy(false)
    }
  }

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy || !text.trim()) return
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const post = await createPublication(text.trim())
      setPosts(previous => [post, ...previous])
      setSearch({ term: '', offset: 0 })
      setText('')
      setNotice('Publicación guardada.')
    } catch (failure) {
      if (failure instanceof ApiError && failure.status === 401) {
        setSession('signed-out')
        setPosts([])
        setError('Tu sesión expiró. Inicia sesión para continuar.')
      } else {
        setError('No pudimos guardar la publicación. Revisa el listado antes de volver a enviarla.')
      }
    } finally {
      setBusy(false)
    }
  }

  async function logout() {
    setBusy(true)
    setError('')
    try {
      await signOut()
      setSession('signed-out')
      setPosts([])
      setText('')
      setNotice('')
    } catch {
      setError('No pudimos cerrar la sesión. Intenta nuevamente.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Header />
      <main className="page-shell" id="publicaciones">
        <div className="page-heading"><h1>Comunidad</h1></div>
        {error && <p className="form-error" role="alert">{error}</p>}
        {session === 'checking' && <p role="status">Comprobando sesión…</p>}
        {session === 'signed-out' && (
          <form className="card composer" onSubmit={login} aria-label="Inicio de sesión">
            <label>Usuario <input autoComplete="username" name="username" required /></label>
            <label>Contraseña <input autoComplete="current-password" name="password" type="password" required /></label>
            <button className="primary-button" disabled={busy}>Iniciar sesión</button>
          </form>
        )}
        {session === 'signed-in' && (
          <section className="feed" aria-label="Publicaciones de la comunidad">
            <button className="secondary-button" type="button" disabled={busy} onClick={logout}>Cerrar sesión</button>
            <form className="card composer" onSubmit={publish}>
              <label htmlFor="post-text">Crear publicación</label>
              <textarea id="post-text" value={text} onChange={event => setText(event.target.value)}
                rows={3} maxLength={1200} required />
              <button className="primary-button" disabled={busy || loading || !text.trim()}>Publicar</button>
            </form>
            {notice && <p role="status">{notice}</p>}
            <form role="search" onSubmit={event => {
              event.preventDefault()
              const term = String(new FormData(event.currentTarget).get('tema')).trim()
              setError('')
              setLoading(true)
              setSearch({ term, offset: 0 })
            }}>
              <label>Buscar por tema <input name="tema" type="search" maxLength={200} /></label>
              <button className="secondary-button">Buscar</button>
            </form>
            <h2>{search.term ? 'Resultados de la búsqueda' : 'Publicaciones recientes'}</h2>
            {loading && <p role="status">Cargando publicaciones…</p>}
            {!loading && !error && posts.length === 0 && <p>{search.term ? 'No se encontraron publicaciones relacionadas.' : 'Todavía no hay publicaciones.'}</p>}
            <div className="post-list">
              {posts.map(post => (
                <article className="card post-card" key={post.id}>
                  <strong>{post.autor.nombre}</strong>
                  <p>{post.contenido}</p>
                  <button className="text-button" aria-expanded={openPost === post.id} onClick={() => setOpenPost(openPost === post.id ? undefined : post.id)}>Comentarios</button>
                  {openPost === post.id && <Comments postId={post.id} />}
                </article>
              ))}
            </div>
            {!loading && !error && <nav aria-label="Páginas de publicaciones">
              {search.offset > 0 && <button className="secondary-button" onClick={() => {
                setLoading(true)
                setSearch({ ...search, offset: Math.max(0, search.offset - 20) })
              }}>Página anterior</button>}
              {search.offset + 20 < total && <button className="secondary-button" onClick={() => {
                setLoading(true)
                setSearch({ ...search, offset: search.offset + 20 })
              }}>Página siguiente</button>}
            </nav>}
            <Fish />
            <Ranking />
            <Notices />
          </section>
        )}
      </main>
    </>
  )
}
