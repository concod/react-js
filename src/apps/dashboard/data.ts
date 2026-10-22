// Mock data, seeded so it looks the same on every load.
export type Day = { date: Date; revenue: number; orders: number; visitors: number }
export type Channel = { name: string; visitors: number }
export type OrderStatus = 'Paid' | 'Pending' | 'Failed'
export type Order = { id: string; customer: string; date: Date; amount: number; status: OrderStatus }
export type Metric = { value: number; change: number }

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}

const rand = rng(42)
const today = new Date(2026, 9, 22)

export const daily: Day[] = Array.from({ length: 180 }, (_, i) => {
  const date = new Date(today)
  date.setDate(today.getDate() - (179 - i))
  const weekend = [0, 6].includes(date.getDay())
  const trend = 3200 + i * 9
  const revenue = Math.round(trend * (weekend ? 0.78 : 1) + (rand() - 0.5) * 900)
  const orders = Math.round(revenue / (58 + rand() * 8))
  const visitors = Math.round(orders * (38 + rand() * 6))
  return { date, revenue, orders, visitors }
})

const channelShare: [string, number][] = [
  ['Organic search', 0.36],
  ['Paid ads', 0.24],
  ['Email', 0.18],
  ['Referral', 0.13],
  ['Social', 0.09],
]

const customers = ['Ava Patel', 'Liam Chen', 'Noah Kim', 'Mia Garcia', 'Zoe Brooks', 'Ethan Ross', 'Isla Novak', 'Leo Martins']
const statuses: OrderStatus[] = ['Paid', 'Paid', 'Paid', 'Pending', 'Paid', 'Failed', 'Paid', 'Pending']

export const orders: Order[] = customers.map((customer, i) => ({
  id: `#${10482 - i}`,
  customer,
  date: new Date(2026, 9, 22 - Math.floor(i / 2)),
  amount: Math.round(40 + rand() * 260) + 0.99,
  status: statuses[i],
}))

const sum = (rows: Day[], key: keyof Omit<Day, 'date'>) => rows.reduce((t, r) => t + r[key], 0)

const ratio = (now: number, before: number): Metric => ({ value: now, change: now / before - 1 })

// Totals for the selected window, compared with the window before it.
export function summarize(days: number) {
  const current = daily.slice(-days)
  const previous = daily.slice(-days * 2, -days)
  const aov = (rows: Day[]) => sum(rows, 'revenue') / sum(rows, 'orders')
  const conversion = (rows: Day[]) => sum(rows, 'orders') / sum(rows, 'visitors')
  const visitors = sum(current, 'visitors')

  return {
    series: current,
    revenue: ratio(sum(current, 'revenue'), sum(previous, 'revenue')),
    orders: ratio(sum(current, 'orders'), sum(previous, 'orders')),
    aov: ratio(aov(current), aov(previous)),
    conversion: ratio(conversion(current), conversion(previous)),
    channels: channelShare.map(([name, share]): Channel => ({ name, visitors: Math.round(visitors * share) })),
  }
}
