import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { readAll, write } from './http'

interface Comment {
  id: number
  autor: { nombre: string }
  contenido: string
}

export function Comments({ postId }: { postId: number }) {
  const path = `/publicaciones/${postId}/comentarios`
  const [comments, setComments] = useState<Comment[]>([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    readAll<Comment>(path, controller.signal).then(result => {
      if (!controller.signal.aborted) { setComments(result); setLoading(false) }
    }, () => {
      if (!controller.signal.aborted) { setError('No pudimos cargar los comentarios.'); setLoading(false) }
    })
    return () => controller.abort()
  }, [path])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving || !draft.trim()) return
    setSaving(true)
    setError('')
    try {
      const saved = await write<Comment>(path, 'POST', { contenido: draft.trim() })
      setComments(previous => [...previous, saved])
      setDraft('')
    } catch { setError('No pudimos guardar el comentario.') }
    finally { setSaving(false) }
  }

  return <section aria-label="Comentarios">
    {error && <p role="alert">{error}</p>}
    {loading && <p role="status">Cargando comentarios…</p>}
    <ul>{comments.map(comment => <li key={comment.id}><strong>{comment.autor.nombre}: </strong>{comment.contenido}</li>)}</ul>
    <form onSubmit={submit}>
      <label>Comentario <textarea value={draft} maxLength={1200} onChange={event => setDraft(event.target.value)} required /></label>
      <button className="secondary-button" disabled={loading || saving || !draft.trim()}>Enviar comentario</button>
    </form>
  </section>
}
