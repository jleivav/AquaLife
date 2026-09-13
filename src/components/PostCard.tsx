import type { Post } from '../types/community'
import { Avatar } from './Avatar'
import { ResultPreview } from './ResultPreview'

interface PostCardProps {
  post: Post
}

const dateFormat = new Intl.DateTimeFormat('es-CL', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

export function PostCard({ post }: PostCardProps) {
  return (
    <article
      className="card post-card"
      id={post.id}
      aria-label={`Publicación de ${post.author.name}`}
    >
      <header className="post-header">
        <Avatar member={post.author} />

        <div className="post-author">
          <h3>{post.author.name}</h3>
          <time dateTime={post.date}>
            {dateFormat.format(new Date(post.date))}
          </time>
        </div>

        <span
          className={`content-badge ${
            post.type === 'Resultado' ? 'content-badge--result' : ''
          }`}
        >
          {post.type}
        </span>
      </header>

      <p className="post-text">{post.text}</p>

      {post.chart && <ResultPreview />}

      {post.image && (
        <img
          className="post-image"
          src={post.image}
          alt={`Imagen compartida por ${post.author.name}`}
        />
      )}

      <div className="post-tags">
        {post.tags.map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
      </div>
    </article>
  )
}