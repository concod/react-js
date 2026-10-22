// React interview drills — senior-level conceptual Q&A + implementable pieces.
// Conceptual questions (no code to "run") are written as answer notes.
// Anything with real logic behind it is implemented as plain TS so you can
// run it with:  npx tsx src/problems/react-questions.ts
// (These are the underlying algorithms/mechanisms, not React components —
// you can't meaningfully unit-test JSX rendering from a bare node script.)

// ══════════════════════════════════════════════════════════════════════
// PART 1 — Conceptual questions. Answer out loud before reading the notes.
// ══════════════════════════════════════════════════════════════════════

// Q1. What does reconciliation actually do, and why do keys matter?
// Your answer: ____________________
// Notes: React diffs the new element tree against the previous one, type by
// type, to decide what DOM work is needed. Without a stable `key`, React
// matches children by POSITION — so reordering/inserting into a list can
// cause React to think existing elements changed identity, leading to lost
// state (e.g. an input losing focus) or unnecessary re-mounts. Index-as-key
// is unsafe specifically when the list can reorder, be filtered, or have
// items inserted/removed from the middle.

// Q2. What actually triggers a re-render?
// Notes: state change (via useState/useReducer setter), a parent re-rendering
// (which re-renders children by default regardless of their own props,
// unless memoized), or context value change for consumers. Re-render !=
// DOM update — React still diffs before touching the DOM.

// Q3. React.memo / useMemo / useCallback — what do they buy you, and when do
// they make things WORSE?
// Notes: they trade CPU (comparing deps/props) for skipping work. They help
// when the skipped work (render, computation, or child re-render) is more
// expensive than the comparison. They hurt when overused on cheap
// components/values — you pay comparison cost + memory for memoized closures
// with no real savings. Also a classic trap: wrapping a callback in
// useCallback but still passing a new inline OBJECT prop each render defeats
// React.memo on the child anyway.

// Q4. useEffect vs useLayoutEffect — concrete scenario where the difference
// is visible to the user.
// Notes: useEffect runs AFTER the browser paints; useLayoutEffect runs
// synchronously after DOM mutations but BEFORE paint. If you measure a DOM
// node's size and then set state to reposition something based on it,
// useEffect causes a visible flicker (paint happens with stale position,
// then snaps) — useLayoutEffect avoids the flicker at the cost of blocking
// paint.

// Q5. Why do the Rules of Hooks exist (no conditional/loop hook calls)?
// Notes: React tracks hook state per component instance as an ORDERED list,
// matched by CALL ORDER across renders, not by name. See the runnable demo
// below (`useMiniState`) — it reimplements this exact mechanism so you can
// see why conditionally skipping a hook call shifts every hook after it.

// Q6. Controlled vs uncontrolled components — tradeoffs.
// Notes: controlled = React state is the single source of truth, value comes
// from props/state, easier to validate/sync but re-renders on every keystroke.
// Uncontrolled = DOM holds the value (refs to read it), less re-render
// overhead, better for simple/large forms or integrating non-React widgets,
// harder to do live validation/derived UI.

// Q7. Context re-render cost — why does a single context value change cause
// every consumer to re-render, and how do you scope around it?
// Notes: every component calling useContext(MyContext) re-renders when the
// PROVIDER's value changes, even if the consumer only reads part of it.
// Fixes: split into multiple smaller contexts by concern, memoize the
// provided value object, or move to a selector-based external store
// (Zustand/Redux) which subscribes components to slices of state instead of
// the whole context tree. See the `createStore` demo below for how a
// selector-based store avoids this.

// Q8. Suspense + error boundaries — what problem do they solve together?
// Notes: Suspense lets a component "pause" rendering while something async
// resolves (data fetch, lazy chunk) and show a fallback instead of handling
// loading state manually in every component. Error boundaries catch render
// errors and show a fallback UI instead of a blank white screen — they're
// separate mechanisms but commonly paired: Suspense boundary for the pending
// state, error boundary for the rejected/error state.

// ══════════════════════════════════════════════════════════════════════
// PART 2 — Implementable mechanisms behind common React answers.
// ══════════════════════════════════════════════════════════════════════

// ── 1. shallowEqual — what React.memo uses by default to compare props ──
// Returns true if two objects have the same keys with === values (one level
// deep — NOT a deep equal, which is exactly why passing a new inline object/
// array/function as a prop breaks memoization).
function shallowEqual(a: Record<string, any>, b: Record<string, any>): boolean {
  if (a === b) return true;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((key) => a[key] === b[key]);
}

console.log(
  "1. shallowEqual same shape:",
  shallowEqual({ id: 1, name: "Ada" }, { id: 1, name: "Ada" }), // true
);
console.log(
  "1. shallowEqual new nested object (the classic memo-breaker):",
  shallowEqual({ style: { color: "red" } }, { style: { color: "red" } }), // false — different object refs
);

// ── 2. debounce — the mechanism behind useDebounce/useDebouncedValue ──
// Contrast with `throttle` in playground.ts: throttle fires at a steady rate
// DURING a burst; debounce waits for a PAUSE before firing once.
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

const debouncedLog = debounce((query: string) => {
  console.log("2. debounced search fired for:", query);
}, 200);
// Simulate fast typing — only the LAST call should actually fire.
["r", "re", "rea", "reac", "react"].forEach((q, i) =>
  setTimeout(() => debouncedLog(q), i * 50),
);
// Expect only ONE log, ~200ms after the last call: "react"

// ── 3. windowing / list virtualization — the math behind react-window ──
// Given scroll position and item/container sizes, compute which item
// indices should actually be rendered (plus a small overscan buffer).
function getVisibleRange(
  scrollTop: number,
  itemHeight: number,
  containerHeight: number,
  totalItems: number,
  overscan = 2,
): { start: number; end: number } {
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const end = Math.min(totalItems - 1, start + visibleCount + overscan * 2);
  return { start, end };
}

console.log(
  "3. visible range at scrollTop=500, itemHeight=50, viewport=300, of 1000 rows:",
  getVisibleRange(500, 50, 300, 1000),
); // renders ~10-14 rows instead of 1000

// ── 4. selector-based store — why it avoids the context re-render problem ──
// A minimal external store: components subscribe with a selector and only
// re-run their callback when the SELECTED slice actually changes — this is
// the core idea behind Zustand/Redux (and useSyncExternalStore).
function createStore<T extends Record<string, any>>(initialState: T) {
  let state = initialState;
  const listeners = new Set<(state: T) => void>();

  function getState() {
    return state;
  }
  function setState(partial: Partial<T>) {
    state = { ...state, ...partial };
    listeners.forEach((listener) => listener(state));
  }
  function subscribe<S>(selector: (state: T) => S, onChange: (value: S) => void) {
    let prevSelected = selector(state);
    const listener = (newState: T) => {
      const nextSelected = selector(newState);
      if (nextSelected !== prevSelected) {
        prevSelected = nextSelected;
        onChange(nextSelected);
      }
    };
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return { getState, setState, subscribe };
}

const store = createStore({ user: { name: "Ada" }, theme: "dark" });
// This "component" only cares about `theme` — it should NOT fire when `user` changes.
store.subscribe(
  (s) => s.theme,
  (theme) => console.log("4. theme-subscriber fired, new theme:", theme),
);
store.setState({ user: { name: "Grace" } }); // theme-subscriber should NOT log
store.setState({ theme: "light" }); // theme-subscriber SHOULD log

// ── 5. useMiniState — reimplementing the hook call-order mechanism ──
// This is the "why do Rules of Hooks exist" answer made concrete: hook state
// is stored in an array indexed by CALL ORDER, not by name, and the index
// resets before each render. If you skip a hook call conditionally, every
// hook after it reads/writes the WRONG slot on the next render.
let hookStates: any[] = [];
let hookIndex = 0;

function useMiniState<T>(initial: T): [T, (value: T) => void] {
  const currentIndex = hookIndex;
  if (hookStates[currentIndex] === undefined) {
    hookStates[currentIndex] = initial;
  }
  const setState = (value: T) => {
    hookStates[currentIndex] = value;
  };
  hookIndex++;
  return [hookStates[currentIndex], setState];
}

function renderMiniComponent(skipSecondHook: boolean) {
  hookIndex = 0; // React does this before every render
  const [count, setCount] = useMiniState(0);
  let label = "no-label";
  if (!skipSecondHook) {
    // BUG (intentionally demonstrated): calling a hook conditionally.
    [label] = useMiniState("initial-label");
  }
  const [flag] = useMiniState(true);
  return { count, label, flag };
}

console.log("5. render 1 (hook not skipped):", renderMiniComponent(false));
console.log(
  "5. render 2 (hook SKIPPED — watch `flag` silently become the label's slot):",
  renderMiniComponent(true),
);
hookStates = []; // reset for a clean re-run if you execute this file again
