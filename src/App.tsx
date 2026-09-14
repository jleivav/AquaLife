import { useEffect, useSyncExternalStore } from 'react'
import { CommunityPage } from './pages/CommunityPage'
import { DashboardPage } from './pages/DashboardPage'
import { getHash, getPage, subscribeToHash } from './navigation'
import './App.css'

export default function App() {
  const hash = useSyncExternalStore(subscribeToHash, getHash)
  const page = getPage(hash)

  useEffect(() => {
    document.title = `Aqua Life · ${page === 'community' ? 'Comunidad' : 'Inicio'}`
    // Espera al montaje para que los enlaces a ranking y publicaciones encuentren su destino.
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(hash.slice(1))
      if (target) target.scrollIntoView({ block: 'start' })
      else window.scrollTo(0, 0)
    })
    return () => cancelAnimationFrame(frame)
  }, [hash, page])

  return page === 'community' ? <CommunityPage /> : <DashboardPage />
}
