import { Suspense } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { apps } from './apps/registry'
import './App.css'

function App() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const wide = apps.some((app) => app.wide && pathname === `/${app.slug}`)

  return (
    <div style={{ maxWidth: wide ? 1200 : 720, margin: '0 auto', padding: '2rem 1rem', textAlign: 'left' }}>
      {!isHome && (
        <Link to="/" style={{ display: 'inline-block', marginBottom: '1.5rem' }}>
          ← All apps
        </Link>
      )}

      <Suspense fallback={<p>Loading…</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          {apps.map((app) => (
            <Route key={app.slug} path={`/${app.slug}`} element={<app.Component />} />
          ))}
          <Route path="*" element={<p>Not found. <Link to="/">Go home</Link></p>} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
