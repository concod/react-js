import { useEffect, useMemo, useRef, useState } from "react";

// ── Variant 1: debounce a CALLBACK ──
// Returns a stable debounced version of `fn`. Call it as often as you like;
// `fn` only runs after `delay` ms of quiet.
export function useDebouncedCallback<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
) {
  // Keep the latest fn in a ref so the debounced wrapper always calls the
  // freshest closure without needing to be recreated (avoids stale-closure bugs).
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  // Create the debounced wrapper ONCE — stable identity across renders.
  return useMemo(() => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fnRef.current(...args), delay);
    };
  }, [delay]);
}

// ── Variant 2: debounce a VALUE ──
// Returns a copy of `value` that only updates after `delay` ms of no changes.
// Classic use: debounce a search box's text before firing an API call.
// export function useDebounce<T>(value: T, delay: number): T {
//   const [debounced, setDebounced] = useState(value);

//   useEffect(() => {
//     const timeout = setTimeout(() => setDebounced(value), delay);
//     // Cleanup cancels the pending timer if `value` changes before it fires —
//     // THIS is what makes it debounce rather than just delay.
//     return () => clearTimeout(timeout);
//   }, [value, delay]);

//   return debounced;
// }

export function useDebounce(value: string = "", delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(id);
    };
  }, [value, delay]);

  return debouncedValue;
}
