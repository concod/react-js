import { useState } from 'react'
import { BarChart, LineChart } from './charts'
import { orders, summarize, type Metric, type OrderStatus } from './data'
import './dashboard.css'

const ranges = [7, 30, 90]

const money = (n: number, digits = 0) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: digits, minimumFractionDigits: digits })

const statusIcon: Record<OrderStatus, string> = { Paid: '✓', Pending: '●', Failed: '✕' }

function StatTile({ label, metric, format }: { label: string; metric: Metric; format: (v: number) => string }) {
  const up = metric.change >= 0
  return (
    <div className="card stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{format(metric.value)}</div>
      <div className={`delta ${up ? 'up' : 'down'}`}>
        {up ? '▲' : '▼'} {Math.abs(metric.change * 100).toFixed(1)}% <span className="muted">vs previous period</span>
      </div>
    </div>
  )
}

// Styled from the tokens in /DESIGN.md.
export default function Dashboard() {
  const [days, setDays] = useState(30)
  const s = summarize(days)

  return (
    <div className="dash">
      <header className="dash-header">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Store overview · mock data</p>
        </div>
        <div className="pills" role="group" aria-label="Date range">
          {ranges.map((r) => (
            <button key={r} className={`pill ${days === r ? 'active' : ''}`} aria-pressed={days === r}
              onClick={() => setDays(r)}>
              Last {r} days
            </button>
          ))}
        </div>
      </header>

      <section className="stats">
        <StatTile label="Revenue" metric={s.revenue} format={(v) => money(v)} />
        <StatTile label="Orders" metric={s.orders} format={(v) => v.toLocaleString()} />
        <StatTile label="Average order" metric={s.aov} format={(v) => money(v, 2)} />
        <StatTile label="Conversion rate" metric={s.conversion} format={(v) => `${(v * 100).toFixed(2)}%`} />
      </section>

      <section className="charts">
        <div className="card">
          <h2>Revenue per day</h2>
          <LineChart data={s.series} format={(v) => money(v)} />
        </div>
        <div className="card">
          <h2>Visitors by channel</h2>
          <BarChart data={s.channels} />
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
    </div>
  )
}
