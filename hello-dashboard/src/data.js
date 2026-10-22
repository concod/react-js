// Mock data, seeded so it looks the same on every load.
function rng(seed) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}

const rand = rng(42)
const today = new Date(2026, 9, 22)

export const daily = Array.from({ length: 180 }, (_, i) => {
  const date = new Date(today)
  date.setDate(today.getDate() - (179 - i))
  const weekend = [0, 6].includes(date.getDay())
  const trend = 3200 + i * 9
  const revenue = Math.round(trend * (weekend ? 0.78 : 1) + (rand() - 0.5) * 900)
  const orders = Math.round(revenue / (58 + rand() * 8))
  const visitors = Math.round(orders * (38 + rand() * 6))
  return { date, revenue, orders, visitors }
})

export const channels = ['Organic search', 'Paid ads', 'Email', 'Referral', 'Social']
const channelShare = [0.36, 0.24, 0.18, 0.13, 0.09]

const customers = ['Ava Patel', 'Liam Chen', 'Noah Kim', 'Mia Garcia', 'Zoe Brooks', 'Ethan Ross', 'Isla Novak', 'Leo Martins']
const statuses = ['Paid', 'Paid', 'Paid', 'Pending', 'Paid', 'Failed', 'Paid', 'Pending']

export const orders = customers.map((customer, i) => ({
  id: `#${10482 - i}`,
  customer,
  date: new Date(2026, 9, 22 - Math.floor(i / 2)),
  amount: Math.round(40 + rand() * 260) + 0.99,
  status: statuses[i],
}))

function sum(rows, key) {
  return rows.reduce((t, r) => t + r[key], 0)
}

// Totals for the selected window, compared with the window before it.
export function summarize(days) {
  const current = daily.slice(-days)
  const previous = daily.slice(-days * 2, -days)
  const metric = (key) => {
    const now = sum(current, key)
    const before = sum(previous, key)
    return { value: now, change: (now - before) / before }
  }
  const revenue = metric('revenue')
  const ordersM = metric('orders')
  const visitors = metric('visitors')
  const conv = (rows) => sum(rows, 'orders') / sum(rows, 'visitors')
  const convNow = conv(current)
  return {
    series: current,
    revenue,
    orders: ordersM,
    aov: { value: revenue.value / ordersM.value, change: revenue.value / ordersM.value / (sum(previous, 'revenue') / sum(previous, 'orders')) - 1 },
    conversion: { value: convNow, change: convNow / conv(previous) - 1 },
    channels: channels.map((name, i) => ({ name, visitors: Math.round(visitors.value * channelShare[i]) })),
  }
}
