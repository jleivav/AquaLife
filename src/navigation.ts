export type Page = 'home' | 'simulation' | 'community'

// Las anclas de Comunidad siguen funcionando desde cualquier pantalla.
export function getPage(hash: string): Page {
  if (['#simulacion', '#simulacion-contenido'].includes(hash)) return 'simulation'
  if (['#comunidad', '#publicaciones', '#ranking', '#notificaciones', '#community-filters', '#connections-title'].includes(hash)
    || hash.startsWith('#post-')) return 'community'
  return 'home'
}

export function subscribeToHash(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

export function getHash() {
  return window.location.hash
}
