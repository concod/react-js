import { lazy, type ComponentType } from 'react'

export type PracticeApp = {
  /** URL slug, e.g. "counter" -> /counter */
  slug: string
  title: string
  description: string
  Component: ComponentType
  /** Use the full page width instead of the narrow 720px column. */
  wide?: boolean
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
    slug: 'rating',
    title: 'Star Rating',
    description: 'Clickable stars with hover, half-star, disabled. Tier 1 staple.',
    Component: lazy(() => import('./rating')),
  },
  {
    slug: 'debounce',
    title: 'Debounce',
    description: 'Implement debounce from scratch (vanilla JS). Tier 1.',
    Component: lazy(() => import('./debounce')),
  },
  {
    slug: 'stopwatch',
    title: 'Stopwatch',
    description: 'setInterval + useEffect cleanup; stale-closure trap. Tier 2.',
    Component: lazy(() => import('./stopwatch')),
  },
  {
    slug: 'table',
    title: 'Sortable Table',
    description: 'Sort a positions table by any column, asc/desc. Tier 2, finance angle.',
    Component: lazy(() => import('./table')),
  },
  {
    slug: 'problems',
    title: 'JS Problems',
    description: 'flatten, curry, memoize… output in the browser console.',
    Component: lazy(() => import('./problems')),
  },
  {
    slug: 'promises',
    title: 'Promises Practice',
    description: 'chaining, Promise.all/race/allSettled polyfills, build-your-own Promise.',
    Component: lazy(() => import('./promises')),
  },
  {
    slug: 'file-explorer',
    title: 'File Explorer',
    description: 'Recursive expand/collapse tree; dirs before files, sorted.',
    Component: lazy(() => import('./file-explorer')),
  },
  {
    slug: 'modal',
    title: 'Modal Dialog',
    description: 'Reusable centered modal with overlay. Portals, Escape, focus.',
    Component: lazy(() => import('./modal')),
  },
  {
    slug: 'counter',
    title: 'Counter',
    description: 'A classic useState counter — the "hello world" of React.',
    Component: lazy(() => import('./counter')),
  },
  {
    slug: 'autocomplete',
    title: 'Autocomplete',
    description: 'Typeahead search with debounced input and keyboard navigation. Tier 2 staple.',
    Component: lazy(() => import('./autocomplete')),
  },
  {
    slug: 'dashboard',
    title: 'Dashboard',
    description: 'Stat tiles, SVG line + bar charts, orders table. Styled from DESIGN.md.',
    Component: lazy(() => import('./dashboard')),
    wide: true,
  },
]
