import { CitySuggestion } from '../types/weather.types';

export function formatSuggestionLabel(suggestion: CitySuggestion): string {
  return suggestion.state
    ? `${suggestion.name}, ${suggestion.state}, ${suggestion.country}`
    : `${suggestion.name}, ${suggestion.country}`;
}

export function formatSuggestionQuery(suggestion: CitySuggestion): string {
  return `${suggestion.name},${suggestion.country}`;
}
