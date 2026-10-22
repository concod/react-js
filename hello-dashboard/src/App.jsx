import { useState } from 'react'
import { BarChart, LineChart } from './charts.jsx'
import { orders, summarize } from './data.js'
import './index.css'

const ranges = [
  { days: 7, label: '7 days' },
  { days: 30, label: '30 days' },
  { days: 90, label: '90 days' },
]

const money = (n, digits = 0) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: digits, minimumFractionDigits: digits })

const statusIcon = { Paid: '✓', Pending: '●', Failed: '✕' }

function StatTile({ label, value, change }) {
  const up = change >= 0
  return (
    <div className="card stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className={`delta ${up ? 'up' : 'down'}`}>
        {up ? '▲' : '▼'} {Math.abs(change * 100).toFixed(1)}% <span className="muted">vs previous period</span>
      </div>
    </div>
  )
}

export default function App() {
  const [days, setDays] = useState(30)
  const s = summarize(days)

  return (
    <main className="page">
      <header className="header">
        <div>
          <h1>Hello, dashboard</h1>
          <p className="muted">Store overview · mock data</p>
        </div>
        <div className="pills" role="group" aria-label="Date range">
          {ranges.map((r) => (
            <button key={r.days} className={`pill ${days === r.days ? 'active' : ''}`} aria-pressed={days === r.days}
              onClick={() => setDays(r.days)}>
              Last {r.label}
            </button>
          ))}
        </div>
      </header>

      <section className="stats">
        <StatTile label="Revenue" value={money(s.revenue.value)} change={s.revenue.change} />
        <StatTile label="Orders" value={s.orders.value.toLocaleString()} change={s.orders.change} />
        <StatTile label="Average order" value={money(s.aov.value, 2)} change={s.aov.change} />
        <StatTile label="Conversion rate" value={`${(s.conversion.value * 100).toFixed(2)}%`} change={s.conversion.change} />
      </section>

      <section className="grid">
        <div className="card">
          <h2>Revenue per day</h2>
          <LineChart data={s.series} valueKey="revenue" format={(v) => money(v)} />
        </div>
        <div className="card">
          <h2>Visitors by channel</h2>
          <BarChart data={s.channels} labelKey="name" valueKey="visitors" />
        </div>
      </section>

      <section className="card">
        <h2>Recent orders</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th className="num">Amount</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.customer}</td>
                  <td>{o.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  <td>
                    <span className={`status ${o.status.toLowerCase()}`}>
                      <span aria-hidden="true">{statusIcon[o.status]}</span> {o.status}
                    </span>
                  </td>
                  <td className="num">{money(o.amount, 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
