import { useEffect, useState } from 'react'
import { readAll } from './http'

interface Notice {
  id: number
  tipo: 'respuestas' | 'ranking'
  mensaje: string
  creada_en: string
}

export function Notices() {
  const [notices, setNotices] = useState<Notice[]>()
  const [version, setVersion] = useState(0)
  const [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    readAll<Notice>('/notificaciones', controller.signal).then(result => {
      if (!controller.signal.aborted) setNotices(result)
    }, () => {
      if (!controller.signal.aborted) setError('No pudimos cargar los avisos.')
    })
    return () => controller.abort()
  }, [version])

  return <section className="card composer" id="notificaciones">
    <h2>Notificaciones</h2>
    <button className="secondary-button" onClick={() => { setNotices(undefined); setError(''); setVersion(value => value + 1) }}>Actualizar avisos</button>
    {error && <p role="alert">{error}</p>}
    {!error && !notices && <p role="status">Cargando avisos…</p>}
    {notices?.length === 0 && <p>Todavía no tienes avisos.</p>}
    <ul>{notices?.map(notice => <li key={notice.id}>
      <strong>{notice.tipo === 'ranking' ? 'Ranking' : 'Respuesta'}</strong> {notice.mensaje}
      {' '}<time dateTime={notice.creada_en}>{new Date(notice.creada_en).toLocaleString('es-CL')}</time>
    </li>)}</ul>
  </section>
}
