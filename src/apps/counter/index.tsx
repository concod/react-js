import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ display: 'grid', gap: '1rem', justifyItems: 'start' }}>
      <p style={{ fontSize: '2rem', margin: 0 }}>Count: {count}</p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => setCount((c) => c - 1)}>-1</button>
        <button onClick={() => setCount((c) => c + 1)}>+1</button>
        <button onClick={() => setCount(0)}>Reset</button>
      </div>
    </div>
  )
}
