import { lazy, type ComponentType } from 'react'

export type PracticeApp = {
  /** URL slug, e.g. "counter" -> /counter */
  slug: string
  title: string
  description: string
  Component: ComponentType
}

/**
 * Register a new practice app here.
 * 1. Create a folder under src/apps/<name>/ with an index.tsx that default-exports a component.
 * 2. Add an entry below. It shows up on the home page and gets its own route automatically.
 */
export const apps: PracticeApp[] = [
  {
    slug: 'todo',
    title: 'Todo App',
    description: 'Add, toggle, delete, count remaining. Tier 1 interview staple.',
    Component: lazy(() => import('./todo')),
  },
  {
    slug: 'counter',
    title: 'Counter',
    description: 'A classic useState counter — the "hello world" of React.',
    Component: lazy(() => import('./counter')),
  },
]
