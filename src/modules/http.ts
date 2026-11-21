import { authenticated } from '../api'

export interface Page<T> {
  total: number
  resultados: T[]
  mensaje?: string
}

export function read<T>(path: string, signal?: AbortSignal) {
  return authenticated<T>(path, { signal })
}

export function write<T>(path: string, method: 'POST' | 'PATCH', value: object) {
  return authenticated<T>(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(value),
  })
}

export async function readAll<T>(path: string, signal?: AbortSignal) {
  const result: T[] = []
  while (true) {
    const separator = path.includes('?') ? '&' : '?'
    const page = await read<Page<T>>(`${path}${separator}limite=100&desplazamiento=${result.length}`, signal)
    result.push(...page.resultados)
    if (!page.resultados.length || result.length >= page.total) return result
  }
}
