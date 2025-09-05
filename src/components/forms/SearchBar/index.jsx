import React, { useEffect, useRef, useState } from "react";

export const SearchBar = ({
  value, // controlled value from parent (chips/search state)
  onChange, // called immediately on each keystroke
  onSearch, // called debounced AND on submit/clear
  placeholder = "Search stays, cities…",
  delay = 300,
  className = "",
}) => {
  const [query, setQuery] = useState(value ?? "");
  const inputRef = useRef(null);

  /* Keep internal state in sync with external (chips) value */
  useEffect(() => {
    if (typeof value === "string" && value !== query) {
      setQuery(value);
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Debounce to fire onSearch after the user stops typing */
  useEffect(() => {
    const t = setTimeout(() => {
      onSearch?.(query.trim());
    }, delay);
    return () => clearTimeout(t);
  }, [query, delay, onSearch]);

  const handleInput = (e) => {
    const next = e.target.value;
    setQuery(next);
    onChange?.(next); // keep parent (chips) state in sync immediately
  };

  const submitNow = () => onSearch?.(query.trim());

  const clear = () => {
    setQuery("");
    onChange?.("");
    onSearch?.("");
    inputRef.current?.focus();
  };

  const isEmpty = query.trim().length === 0;

  return (
    <div className={`w-full ${className}`}>
      <form
        role="search"
        aria-label="Search venues"
        onSubmit={(e) => {
          e.preventDefault();
          submitNow();
        }}
      >
        <label htmlFor="search" className="sr-only">
          Search
        </label>

        <div className="relative flex items-center">
          {/* Input */}
          <input
            id="search"
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInput}
            onKeyDown={(e) => e.key === "Escape" && clear()}
            placeholder={placeholder}
            className="bg-surface/80 text-primary placeholder-secondary/70 ring-secondary/15 focus:ring-accent/40 h-11 w-full rounded-2xl pr-28 text-sm outline-none ring-1 transition focus:ring-2"
          />

          {/* Actions (right) */}
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
            {!isEmpty && (
              <button
                type="button"
                onClick={clear}
                aria-label="Clear search"
                className="text-secondary ring-secondary/15 hover:text-primary inline-flex h-8 w-8 items-center justify-center rounded-lg ring-1"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}

            <button
              type="submit"
              aria-label="Search"
              className="border-accent bg-surface text-accent hover:bg-accent focus:ring-accent/50 inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium shadow-sm transition hover:text-white focus:outline-none focus:ring-2"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
