import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { read, readAll, write } from './http'

interface Species { id: number; nombre: string; caracteristicas: string; cuidados: string }
interface FishRecord { id: number; nombre: string; especie: number }

export function Fish() {
  const [fish, setFish] = useState<FishRecord[]>()
  const [species, setSpecies] = useState<Species[]>([])
  const [matches, setMatches] = useState<Species[]>()
  const [detail, setDetail] = useState<Species>()
  const [editing, setEditing] = useState<number>()
  const [name, setName] = useState('')
  const [speciesId, setSpeciesId] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    Promise.all([readAll<FishRecord>('/peces', controller.signal), readAll<Species>('/especies', controller.signal)])
      .then(([records, catalog]) => {
        if (!controller.signal.aborted) { setFish(records); setSpecies(catalog); setMatches(catalog) }
      }, () => { if (!controller.signal.aborted) setError('No pudimos cargar peces y especies.') })
    return () => controller.abort()
  }, [])

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const term = String(new FormData(event.currentTarget).get('especie')).trim()
    setBusy(true)
    setError('')
    setDetail(undefined)
    try {
      const query = term ? `?busqueda=${encodeURIComponent(term)}` : ''
      const result = await readAll<Species>(`/especies${query}`)
      setMatches(result)
    } catch { setError('No pudimos buscar especies.') }
    finally { setBusy(false) }
  }

  async function showSpecies(id: number) {
    setBusy(true)
    setError('')
    try { setDetail(await read<Species>(`/especies/${id}`)) }
    catch { setError('No pudimos abrir la ficha.') }
    finally { setBusy(false) }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim() || !speciesId) return
    setBusy(true)
    setMessage('')
    setError('')
    try {
      const value = { nombre: name.trim(), especie_id: Number(speciesId) }
      const record = editing
        ? await write<FishRecord>(`/peces/${editing}`, 'PATCH', value)
        : await write<FishRecord>('/peces', 'POST', value)
      setFish(previous => editing
        ? (previous ?? []).map(item => item.id === editing ? record : item)
        : [...(previous ?? []), record])
      setEditing(undefined)
      setName('')
      setSpeciesId('')
      setMessage('Pez guardado.')
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'No pudimos guardar el pez.') }
    finally { setBusy(false) }
  }

  return <section id="peces" className="card composer">
    <h2>Mis peces y especies</h2>
    {error && <p role="alert">{error}</p>}
    {message && <p role="status">{message}</p>}
    {!fish && !error && <p role="status">Cargando peces…</p>}
    <form onSubmit={save}>
      <label>Nombre del pez <input value={name} onChange={event => setName(event.target.value)} maxLength={120} required /></label>
      <label>Especie <select value={speciesId} onChange={event => setSpeciesId(event.target.value)} required>
        <option value="">Elige una especie</option>
        {species.map(item => <option key={item.id} value={item.id}>{item.nombre}</option>)}
      </select></label>
      <button className="secondary-button" disabled={busy || !fish || !name.trim() || !speciesId}> {editing ? 'Guardar cambios' : 'Registrar pez'}</button>
      {editing && <button type="button" className="text-button" onClick={() => { setEditing(undefined); setName(''); setSpeciesId('') }}>Cancelar edición</button>}
    </form>
    {fish?.length === 0 && <p>Tu lista de peces está vacía.</p>}
    <ul>{fish?.map(item => <li key={item.id}>{item.nombre} · {species.find(option => option.id === item.especie)?.nombre ?? 'Especie'}
      {' '}<button className="text-button" disabled={busy} onClick={() => {
        setEditing(item.id)
        setName(item.nombre)
        setSpeciesId(String(item.especie))
        setError('')
        setMessage('')
      }}>Editar {item.nombre}</button>
    </li>)}</ul>
    <h3>Catálogo de especies</h3>
    <form onSubmit={search}>
      <label>Buscar especie <input name="especie" maxLength={200} /></label>
      <button className="secondary-button" disabled={busy}>Consultar especies</button>
    </form>
    {matches?.length === 0 && <p>No se encontró información sobre esa especie.</p>}
    <ul>{matches?.map(item => <li key={item.id}>
      <button className="text-button" disabled={busy} onClick={() => { void showSpecies(item.id) }}>{item.nombre}</button>
    </li>)}</ul>
    {detail && <section aria-label="Ficha de especie">
      <h4>{detail.nombre}</h4>
      <p><strong>Características:</strong> {detail.caracteristicas}</p>
      <p><strong>Cuidados:</strong> {detail.cuidados}</p>
    </section>}
  </section>
}
