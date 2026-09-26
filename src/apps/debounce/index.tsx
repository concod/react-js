import { useEffect, useState } from "react";
import { useDebounce, useDebouncedCallback } from "../../hooks/useDebounce";

export default function DebounceDemo() {
  // ── Variant 1: debounced callback ──
  const [log, setLog] = useState<string[]>([]);
  const debouncedLog = useDebouncedCallback((value: string) => {
    setLog((prev) => [...prev, value]);
  }, 500);

  // ── Variant 2: debounced value (the classic "search box" pattern) ──
  const [text, setText] = useState("");
  const debouncedText = useDebounce(text, 500);

  useEffect(() => {
    if (debouncedText) {
      // Pretend this is an API call fired only after the user stops typing.
      console.log("Searching for:", debouncedText);
    }
  }, [debouncedText]);

  return (
    <div style={{ maxWidth: 460 }}>
      <h1>Debounce</h1>

      <section style={{ marginBottom: "2rem" }}>
        <h3>useDebouncedCallback</h3>
        <p style={{ color: "#94a3b8" }}>
          A line is logged only 500ms after you stop typing.
        </p>
        <input
          placeholder="Type fast…"
          onChange={(e) => debouncedLog(e.target.value)}
        />
        <ul>
          {log.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>useDebounce (value)</h3>
        <p style={{ color: "#94a3b8" }}>Debounced value updates after you pause.</p>
        <input
          placeholder="Search…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <p>
          Live: <code>{text || "—"}</code> · Debounced:{" "}
          <code>{debouncedText || "—"}</code>
        </p>
      </section>
    </div>
  );
}
