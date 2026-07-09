import { useCallback, useEffect, useMemo, useState, memo } from "react";
import "./todo.css";

type Todo = { id: string; name: string; completed: boolean };

// Memoized per-row component: only re-renders when THIS todo (or a handler ref)
// changes — not when a sibling row or the input text changes.
const TodoItem = memo(function TodoItem({
  todo,
  onToggle,
  onDelete,
}: {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <li className={`todo-item ${todo.completed ? "is-done" : ""}`}>
      <label className="todo-label">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <span className="todo-name">{todo.name}</span>
      </label>
      <button
        className="todo-delete"
        aria-label={`Delete ${todo.name}`}
        onClick={() => onDelete(todo.id)}
      >
        ✕
      </button>
    </li>
  );
});

export default function Todo() {
  const [toDos, setTodos] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem("todos");
      return saved ? (JSON.parse(saved) as Todo[]) : [];
    } catch {
      return [];
    }
  });

  const [val, setVal] = useState("");

  // Persist on every change.
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(toDos));
  }, [toDos]);

  const addTodo = useCallback(() => {
    const name = val.trim();
    if (!name) return;
    setTodos((items) => {
      if (items.some((t) => t.name === name)) return items;
      return [...items, { id: crypto.randomUUID(), name, completed: false }];
    });
    setVal("");
  }, [val]);

  // Empty deps: safe because we use the functional updater form, so the
  // handlers never need to close over `toDos`. Stable refs => memo works.
  const handleCompleted = useCallback((id: string) => {
    setTodos((items) =>
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  }, []);

  const handleDelete = useCallback((id: string) => {
    setTodos((items) => items.filter((item) => item.id !== id));
  }, []);

  const remaining = useMemo(
    () => toDos.filter((t) => !t.completed).length,
    [toDos],
  );

  return (
    <div className="todo-app">
      <header className="todo-header">
        <h1>Todo</h1>
        <span className="todo-badge">{remaining} left</span>
      </header>

      <div className="todo-input-row">
        <input
          className="todo-input"
          placeholder="What needs doing?"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTodo();
          }}
        />
        <button className="todo-add" onClick={addTodo}>
          Add
        </button>
      </div>

      {toDos.length === 0 ? (
        <p className="todo-empty">Nothing yet — add your first task.</p>
      ) : (
        <ul className="todo-list">
          {toDos.map((item) => (
            <TodoItem
              key={item.id}
              todo={item}
              onToggle={handleCompleted}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
