import { apiGet } from './client';
import { CitySuggestion } from '../types/weather.types';

export function searchCities(query: string, signal?: AbortSignal): Promise<CitySuggestion[]> {
  return apiGet<CitySuggestion[]>(`/cities?q=${encodeURIComponent(query)}`, signal);
}
