import { useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { contentTypes, currentUser } from '../data/community'
import type { ContentType } from '../types/community'
import { Avatar } from './Avatar'
import { Icon } from './Icon'

interface PostComposerProps {
  onPublish: (text: string, type: ContentType, image?: string) => void
}

export function PostComposer({ onPublish }: PostComposerProps) {
  const [text, setText] = useState('')
  const [type, setType] = useState<ContentType>('Experiencia')
  const [image, setImage] = useState<string>()
  const [error, setError] = useState('')
  const [readingImage, setReadingImage] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  function attachImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 3 * 1024 * 1024) {
      setError('Elige una imagen JPG, PNG o WebP de hasta 3 MB.')
      return
    }
    setError('')
    setReadingImage(true)
    const reader = new FileReader()
    reader.onload = () => {
      setImage(String(reader.result))
      setReadingImage(false)
    }
    reader.onerror = () => {
      setError('No pudimos leer esa imagen. Intenta con otra.')
      setReadingImage(false)
    }
    reader.readAsDataURL(file)
  }

  function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!text.trim() || readingImage) return
    onPublish(text.trim(), type, image)
    setText('')
    setImage(undefined)
    setError('')
  }

  return (
    <section className="card composer" aria-labelledby="composer-title">
      <form onSubmit={publish}>
        <div className="composer-heading">
          <Icon name="message" size={18} /><h2 id="composer-title">Comparte con la comunidad</h2>
          <span className="small-muted">Tu espacio para conectar</span>
        </div>
        <div className="composer-input">
          <Avatar member={currentUser} />
          <label className="sr-only" htmlFor="post-text">Crear publicación</label>
          <textarea id="post-text" value={text} onChange={(event) => setText(event.target.value)}
            placeholder="¿Qué está pasando en tu acuario, Alex?" maxLength={1200} rows={3} required />
        </div>
        {image && (
          <div className="attachment-preview">
            <img src={image} alt="Vista previa de la imagen adjunta" />
            <button className="icon-button" type="button" onClick={() => setImage(undefined)} aria-label="Quitar imagen">
              <Icon name="close" size={17} />
            </button>
          </div>
        )}
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="composer-footer">
          <input ref={fileInput} hidden type="file" accept="image/png,image/jpeg,image/webp" aria-label="Seleccionar imagen" onChange={attachImage} />
          <button type="button" className="text-button attachment-button" onClick={() => fileInput.current?.click()} disabled={readingImage}>
            <Icon name="image" size={19} /><span>{readingImage ? 'Cargando…' : 'Adjuntar'}</span>
          </button>
          <label className="composer-type">
            <span className="sr-only">Tipo de publicación</span>
            <select value={type} onChange={(event) => setType(event.target.value as ContentType)}>
              {contentTypes.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <span className="character-count">{text.length}/1200</span>
          <button type="submit" className="primary-button" disabled={!text.trim() || readingImage}>
            Publicar<Icon name="send" size={16} />
          </button>
        </div>
      </form>
    </section>
  )
}
