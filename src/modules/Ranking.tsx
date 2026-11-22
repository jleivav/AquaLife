import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { read, readAll, write } from './http'

interface Category { id: number; nombre: string }
interface Tank { id: number; nombre: string; litros: string | null; categoria_id: number | null }
interface Participant { id: number; nombre: string; votos: number; posicion: number }
interface RankingResult { resultados: Participant[]; mensaje: string | null }

export function Ranking() {
  const [categories, setCategories] = useState<Category[]>([])
  const [tanks, setTanks] = useState<Tank[]>()
  const [category, setCategory] = useState('')
  const [ranking, setRanking] = useState<RankingResult>()
  const [selected, setSelected] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    Promise.all([read<{ resultados: Category[] }>('/categorias', controller.signal), readAll<Tank>('/peceras', controller.signal)])
      .then(([catalog, owned]) => {
        if (!controller.signal.aborted) { setCategories(catalog.resultados); setTanks(owned) }
      }, () => { if (!controller.signal.aborted) setError('No pudimos cargar peceras y categorías.') })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (!category) return
    const controller = new AbortController()
    read<RankingResult>(`/ranking?categoria=${category}`, controller.signal).then(result => {
      if (!controller.signal.aborted) setRanking(result)
    }, () => { if (!controller.signal.aborted) setError('No pudimos cargar el ranking.') })
    return () => controller.abort()
  }, [category])

  async function execute(action: () => Promise<void>) {
    setBusy(true)
    setError('')
    setStatus('')
    try { await action() }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'No pudimos completar la acción.') }
    finally { setBusy(false) }
  }

  function changeCategory(value: string) {
    setError('')
    setRanking(undefined)
    setCategory(value)
  }

  function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const nombre = String(data.get('nombre')).trim()
    if (!nombre) return
    const litros = String(data.get('litros'))
    const categoria = String(data.get('categoria'))
    void execute(async () => {
      const tank = await write<Tank>('/peceras', 'POST', {
        nombre, litros: litros || null, categoria_id: categoria ? Number(categoria) : null,
      })
      setTanks(previous => [...(previous ?? []), tank])
      setSelected(String(tank.id))
      form.reset()
      setStatus('Pecera registrada.')
    })
  }

  function enroll(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const tank = tanks?.find(item => String(item.id) === selected)
    if (!tank) return
    if (!tank.litros || !tank.categoria_id) {
      setStatus('')
      setError('Completa los litros y la categoría al registrar la pecera antes de inscribirla.')
      return
    }
    void execute(async () => {
      await write<Participant>('/inscripciones', 'POST', { pecera_id: tank.id })
      const nextCategory = String(tank.categoria_id)
      if (nextCategory !== category) changeCategory(nextCategory)
      else setRanking(await read<RankingResult>(`/ranking?categoria=${category}`))
      setStatus('Pecera inscrita.')
    })
  }

  return <section id="ranking" className="card composer">
    <h2>Ranking de peceras</h2>
    {error && <p role="alert">{error}</p>}
    {status && <p role="status">{status}</p>}
    {!tanks && !error && <p role="status">Cargando peceras…</p>}
    <form onSubmit={register} aria-label="Registrar pecera">
      <label>Nombre de la pecera <input name="nombre" maxLength={120} required /></label>
      <label>Litros <input name="litros" type="number" min="0.01" max="9999999.99" step="0.01" /></label>
      <label>Categoría de la pecera <select name="categoria">
        <option value="">Elige una categoría</option>
        {categories.map(item => <option key={item.id} value={item.id}>{item.nombre}</option>)}
      </select></label>
      <button className="secondary-button" disabled={busy || !tanks}>Registrar pecera</button>
    </form>
    <form onSubmit={enroll} aria-label="Inscribir pecera">
      <label>Mi pecera <select value={selected} onChange={event => setSelected(event.target.value)} required>
        <option value="">Elige una pecera</option>
        {tanks?.map(item => <option key={item.id} value={item.id}>{item.nombre}</option>)}
      </select></label>
      <button className="secondary-button" disabled={busy || !selected}>Inscribir pecera</button>
    </form>
    <label>Categoría del ranking <select value={category} disabled={busy} onChange={event => changeCategory(event.target.value)}>
      <option value="">Elige una categoría</option>
      {categories.map(item => <option key={item.id} value={item.id}>{item.nombre}</option>)}
    </select></label>
    {category && !ranking && !error && <p role="status">Cargando ranking…</p>}
    {ranking?.mensaje && <p>{ranking.mensaje}</p>}
    <ol>{ranking?.resultados.map(item => <li key={item.id} value={item.posicion}>
      <strong>{item.nombre}</strong> · {item.votos} votos
    </li>)}</ol>
  </section>
}
