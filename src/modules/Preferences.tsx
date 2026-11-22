import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { read, write } from './http'

interface Settings { respuestas: boolean; ranking: boolean }
const path = '/preferencias-notificaciones'

export function Preferences() {
  const [settings, setSettings] = useState<Settings>()
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    read<Settings>(path, controller.signal).then(value => {
      if (!controller.signal.aborted) setSettings(value)
    }, () => { if (!controller.signal.aborted) setError('No pudimos cargar tus preferencias.') })
    return () => controller.abort()
  }, [])

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!settings || busy) return
    setBusy(true)
    setStatus('')
    setError('')
    try {
      const result = await write<Settings>(path, 'PATCH', settings)
      setSettings(result)
      setStatus('Preferencias guardadas.')
    } catch { setError('No pudimos guardar tus preferencias.') }
    finally { setBusy(false) }
  }

  return <section id="preferencias" className="card composer">
    <h2>Preferencias de notificaciones</h2>
    {error && <p role="alert">{error}</p>}
    {status && <p role="status">{status}</p>}
    {!settings && !error && <p role="status">Cargando preferencias…</p>}
    {settings && <form onSubmit={save}>
      <label><input type="checkbox" checked={settings.respuestas} disabled={busy}
        onChange={event => setSettings({ ...settings, respuestas: event.target.checked })} /> Avisos por respuestas</label>
      <label><input type="checkbox" checked={settings.ranking} disabled={busy}
        onChange={event => setSettings({ ...settings, ranking: event.target.checked })} /> Avisos por posición en el ranking</label>
      <button className="secondary-button" disabled={busy}>Guardar preferencias</button>
    </form>}
  </section>
}
