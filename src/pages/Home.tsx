import { Link } from 'react-router-dom'
import { apps } from '../apps/registry'

export default function Home() {
  return (
    <div>
      <h1>React Practice</h1>
      <p style={{ color: '#888' }}>
        {apps.length} app{apps.length === 1 ? '' : 's'}. Pick one to open.
      </p>
      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.75rem' }}>
        {apps.map((app) => (
          <li key={app.slug}>
            <Link
              to={`/${app.slug}`}
              style={{
                display: 'block',
                padding: '1rem',
                border: '1px solid #333',
                borderRadius: '8px',
                textDecoration: 'none',
              }}
            >
              <strong>{app.title}</strong>
              <div style={{ color: '#888', fontSize: '0.9rem' }}>{app.description}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
