import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { useDebounce } from "../../hooks/useDebounce";

type AutocompleteComponentProps = {
  currInput: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  isOpen?: boolean;
  URL: string;
};

export default function AutocompleteComponent({
  currInput,
  onChange,
  isOpen,
  URL,
}: AutocompleteComponentProps) {
  const cache = useRef(new Map<string, string[]>());
  console.log(cache.current, "cache");
  const lastestQuery = useRef("");

  const [val, setVal] = useState(currInput);
  // typed as string[] so `.map((user) => user.username)` below is known to produce strings
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  // debounce delays the fetch, not the input update — val updates every keystroke,
  // debooucedVal only settles 300ms after typing pauses
  const debooucedVal = useDebounce(val, 300);

  useEffect(() => {
    if (!debooucedVal) return;
    lastestQuery.current = debooucedVal;
    const cachedData = cache.current.get(debooucedVal);
    if (cachedData) {
      setSuggestions(cachedData);
      return;
    }

    // only show a loader for the network path — a cache hit above resolves synchronously
    setIsLoading(true);

    fetch(`${URL}?q=${debooucedVal}`)
      .then((res) => res.json())
      .then((data) => {
        const userData = data?.users?.map((user) => user.username);
        cache.current.set(debooucedVal, userData);
        if (lastestQuery.current === debooucedVal) setSuggestions(userData);
      })
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      })
      .finally(() => setIsLoading(false));

    // return () => {
    //   controller.abort();
    // };
  }, [debooucedVal]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault(); // stop cursor from moving in the input
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault(); // stop cursor from moving in the input
      setActiveIndex(
        (prev) => (prev - 1 + suggestions.length) % suggestions.length,
      );
    }
    if (e.key === "Enter" && activeIndex !== -1) {
      setVal(suggestions[activeIndex]);
      setSuggestions([]);
      setActiveIndex(-1);
    }

    if (e.key === "Escape") {
      setSuggestions([]);
      setActiveIndex(-1);
    }
  };

  const displayValue = activeIndex === -1 ? val : suggestions[activeIndex];

  return (
    <div style={{ position: "relative" }}>
      <input
        value={displayValue}
        role="combobox"
        aria-expanded={suggestions.length > 0}
        aria-controls="autocomplete-listbox"
        aria-autocomplete="list"
        // points screen readers at the currently highlighted option's id, since
        // focus never actually leaves the input during keyboard navigation
        aria-activedescendant={
          activeIndex === -1 ? undefined : `option-${activeIndex}`
        }
        type="text"
        onKeyDown={handleKeyDown}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setVal(e.target.value)}
      />
      {isLoading && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            padding: "4px 8px",
            backgroundColor: "white",
            color: "gray",
          }}
        >
          Loading...
        </div>
      )}
      {!isLoading && suggestions.length > 0 && (
        <ul
          onMouseLeave={() => setActiveIndex(-1)}
          id="autocomplete-listbox"
          role="listbox"
          style={{
            position: "absolute",
            backgroundColor: "white",

            width: "100%",
            listStyle: "none",
          }}
        >
          {suggestions.map((item, idx) => (
            // role="option" + aria-selected pairs with role="listbox" on the <ul>
            // above, and id matches aria-activedescendant on the input
            <li
              key={item}
              id={`option-${idx}`}
              role="option"
              aria-selected={activeIndex === idx}
              style={{
                color: "black",
                cursor: "pointer",
                backgroundColor: activeIndex === idx ? "pink" : "unset",
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
