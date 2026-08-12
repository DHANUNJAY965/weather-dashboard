import { useEffect, useRef, useState } from 'react';
import { searchCities } from '../api/geocodingApi';
import { CitySuggestion } from '../types/weather.types';

const MIN_QUERY_LENGTH = 2;

export function useCitySuggestions(query: string): CitySuggestion[] {
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortControllerRef.current?.abort();

    const trimmed = query.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    searchCities(trimmed, controller.signal)
      .then(setSuggestions)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        setSuggestions([]);
      });
  }, [query]);

  return suggestions;
}
