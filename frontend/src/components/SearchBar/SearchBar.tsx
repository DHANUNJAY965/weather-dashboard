import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useCitySuggestions } from '../../hooks/useCitySuggestions';
import { CitySuggestion } from '../../types/weather.types';
import { formatSuggestionLabel, formatSuggestionQuery } from '../../utils/formatCitySuggestion';

const DEBOUNCE_DELAY_MS = 350;

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [suppressSuggestions, setSuppressSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_DELAY_MS);
  const suggestions = useCitySuggestions(suppressSuggestions ? '' : debouncedQuery);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function selectSuggestion(suggestion: CitySuggestion) {
    setSuppressSuggestions(true);
    setQuery(formatSuggestionLabel(suggestion));
    setIsOpen(false);
    setHighlightedIndex(-1);
    onSearch(formatSuggestionQuery(suggestion));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }
    setSuppressSuggestions(true);
    setIsOpen(false);
    onSearch(trimmed);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || suggestions.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((index) => Math.min(index + 1, suggestions.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
    } else if (event.key === 'Enter' && highlightedIndex >= 0) {
      event.preventDefault();
      selectSuggestion(suggestions[highlightedIndex]);
    }
  }

  const showSuggestions = isOpen && suggestions.length > 0;

  return (
    <div ref={containerRef} className="relative w-full">
      <form
        onSubmit={handleSubmit}
        className="flex w-full items-center gap-2 rounded-lg border border-white/25 bg-black/55 p-3 shadow-lg backdrop-blur-sm"
      >
        <Search className="ml-1 h-5 w-5 shrink-0 text-white/70" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSuppressSuggestions(false);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder="Enter city..."
          aria-label="City name"
          role="combobox"
          aria-expanded={showSuggestions}
          aria-controls="city-suggestions"
          aria-autocomplete="list"
          autoComplete="off"
          className="w-full bg-transparent text-lg font-light text-white placeholder-white/60 outline-none"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="shrink-0 rounded-md border border-white/25 bg-white/10 px-4 py-2 font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Search
        </button>
      </form>

      {showSuggestions && (
        <ul
          id="city-suggestions"
          role="listbox"
          className="absolute z-10 mt-2 w-full overflow-hidden rounded-lg border border-white/20 bg-black/80 text-white shadow-lg backdrop-blur-sm"
        >
          {suggestions.map((suggestion, index) => (
            <li key={`${suggestion.name}-${suggestion.lat}-${suggestion.lon}`} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={index === highlightedIndex}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => selectSuggestion(suggestion)}
                className={`block w-full px-4 py-2 text-left text-sm transition ${
                  index === highlightedIndex ? 'bg-white/15' : 'hover:bg-white/10'
                }`}
              >
                {formatSuggestionLabel(suggestion)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
