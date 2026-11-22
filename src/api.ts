export interface Publication {
  id: number
  contenido: string
  autor: { id: number; nombre: string }
  creada_en: string
}

interface SessionResponse {
  access: string
  csrf?: string
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

let access: string | undefined
let csrf: string | undefined
let renewal: Promise<void> | undefined

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api/v1${path}`, { ...options, credentials: 'same-origin' })
  if (!response.ok) {
    const body: unknown = await response.json().catch(() => undefined)
    const envelope = body as { error?: { detalles?: unknown } } | undefined
    const details = envelope?.error?.detalles
    const detail = details && typeof details === 'object' && 'detail' in details && typeof details.detail === 'string'
      ? details.detail : undefined
    if (response.status === 403) throw new ApiError(403, detail ?? 'La solicitud fue rechazada.')
    if (response.status === 409) throw new ApiError(409, detail ?? 'La operación entra en conflicto con un registro existente.')
    if (response.status === 401) throw new ApiError(401, 'La sesión o las credenciales no son válidas.')
    throw new ApiError(response.status, 'No se pudo completar la solicitud.')
  }
  return (response.status === 204 ? undefined : await response.json()) as T
}

async function sessionPost<T>(path: string, data: object = {}): Promise<T> {
  csrf ??= (await request<{ csrf: string }>('/auth/csrf')).csrf
  return request<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrf },
    body: JSON.stringify(data),
  })
}

async function withSessionLock<T>(action: () => Promise<T>): Promise<T> {
  return navigator.locks ? navigator.locks.request('aqualife-session', action) : action()
}

export function restoreSession(): Promise<void> {
  renewal ??= withSessionLock(async () => {
    try {
      csrf = undefined
      access = (await sessionPost<SessionResponse>('/auth/refresh')).access
    } catch (error) {
      access = undefined
      throw error
    }
  }).finally(() => { renewal = undefined })
  return renewal
}

export function signIn(username: string, password: string): Promise<void> {
  return withSessionLock(async () => {
    csrf = undefined
    const session = await sessionPost<SessionResponse>('/auth/login', { username, password })
    access = session.access
    csrf = session.csrf
  })
}

export function signOut(): Promise<void> {
  return withSessionLock(async () => {
    csrf = undefined
    await sessionPost('/auth/logout')
    access = undefined
  })
}

export async function authenticated<T>(path: string, options?: RequestInit): Promise<T> {
  const sent = access
  const send = () => request<T>(path, {
    ...options,
    headers: { ...options?.headers, Authorization: `Bearer ${access}` },
  })
  try {
    if (!access) await restoreSession()
    return await send()
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401 || !sent) throw error
  }
  if (sent === access) await restoreSession()
  return send()
}

export function listPublications(signal?: AbortSignal, tema = '', offset = 0) {
  const query = new URLSearchParams({ limite: '20', desplazamiento: String(offset) })
  if (tema) query.set('tema', tema)
  return authenticated<{ resultados: Publication[]; total: number }>(`/publicaciones?${query}`, { signal })
}

export function createPublication(contenido: string) {
  return authenticated<Publication>('/publicaciones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contenido }),
  })
}
