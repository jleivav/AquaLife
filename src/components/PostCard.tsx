import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Post } from '../types/community'
import { Avatar } from './Avatar'
import { Icon } from './Icon'
import { ResultPreview } from './ResultPreview'

interface PostCardProps {
  post: Post
  onLike: () => void
  onSave: () => void
  onComment: (text: string) => void
  onTagChange: (tag: string) => void
}

const dateFormat = new Intl.DateTimeFormat('es-CL', {
  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
})

export function PostCard({ post, onLike, onSave, onComment, onTagChange }: PostCardProps) {
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [comment, setComment] = useState('')

  function addComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!comment.trim()) return
    onComment(comment.trim())
    setComment('')
  }

  return (
    <article className="card post-card" id={post.id} aria-label={`Publicación de ${post.author.name}`}>
      <header className="post-header">
        <Avatar member={post.author} />
        <div className="post-author">
          <h3>{post.author.name}</h3>
          <time dateTime={post.date}>{dateFormat.format(new Date(post.date))}</time>
        </div>
        <span className={`content-badge ${post.type === 'Resultado' ? 'content-badge--result' : ''}`}>{post.type}</span>
      </header>
      <p className="post-text">{post.text}</p>
      {post.chart && <ResultPreview />}
      {post.image && <img className="post-image" src={post.image} alt={`Imagen compartida por ${post.author.name}`} />}
      <div className="post-tags">
        {post.tags.map((tag) => <button key={tag} onClick={() => onTagChange(tag)}>#{tag}</button>)}
      </div>
      <footer className="post-actions">
        <button className={`post-action ${post.liked ? 'is-active' : ''}`} onClick={onLike} aria-pressed={post.liked}
          aria-label={`${post.liked ? 'Quitar me gusta' : 'Me gusta'} a la publicación de ${post.author.name}`}>
          <Icon name="like" size={18} /><span>{post.likes}</span><span className="action-label">Me gusta</span>
        </button>
        <button className="post-action" onClick={() => setCommentsOpen(!commentsOpen)}
          aria-label={`Comentarios de la publicación de ${post.author.name}: ${post.comments.length}`}
          aria-expanded={commentsOpen} aria-controls={`comments-${post.id}`}>
          <Icon name="message" size={18} />{post.comments.length}<span className="action-label">Comentarios</span>
        </button>
        <button className={`post-action save-action ${post.saved ? 'is-active' : ''}`} onClick={onSave} aria-pressed={post.saved}
          aria-label={`${post.saved ? 'Quitar de guardados' : 'Guardar publicación'} de ${post.author.name}`}>
          <Icon name="bookmark" size={18} /><span className="action-label">{post.saved ? 'Guardado' : 'Guardar'}</span>
        </button>
      </footer>
      {commentsOpen && (
        <section className="comments" id={`comments-${post.id}`} aria-label="Comentarios">
          <div className="comment-list" aria-live="polite">
            {post.comments.length === 0 && <p className="small-muted">Inicia la conversación. Comparte tu experiencia.</p>}
            {post.comments.map((item) => (
              <div className="comment" key={item.id}><strong>{item.author}</strong><p>{item.text}</p></div>
            ))}
          </div>
          <form onSubmit={addComment} className="comment-form">
            <label className="sr-only" htmlFor={`comment-${post.id}`}>Escribir comentario</label>
            <input id={`comment-${post.id}`} placeholder="Escribe un comentario…" value={comment}
              onChange={(event) => setComment(event.target.value)} maxLength={400} required />
            <button className="icon-button" type="submit" disabled={!comment.trim()} aria-label="Publicar comentario">
              <Icon name="send" size={18} />
            </button>
          </form>
        </section>
      )}
    </article>
  )
}
