import axios from 'axios';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { buildCacheKey, getCached, setCached } from './cache.service';
import { CitySuggestion, OpenWeatherGeocodingResult } from '../types/geocoding.types';

const GEOCODING_URL = 'https://api.openweathermap.org/geo/1.0/direct';
const SUGGESTION_LIMIT = 5;
const REQUEST_TIMEOUT_MS = 5000;

export async function searchCities(query: string): Promise<CitySuggestion[]> {
  const cacheKey = buildCacheKey('suggest', query);

  const cached = getCached<CitySuggestion[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const suggestions = await fetchCitySuggestions(query);
  setCached(cacheKey, suggestions);

  return suggestions;
}

async function fetchCitySuggestions(query: string): Promise<CitySuggestion[]> {
  try {
    const response = await axios.get<OpenWeatherGeocodingResult[]>(GEOCODING_URL, {
      params: {
        q: query,
        limit: SUGGESTION_LIMIT,
        appid: env.openWeatherApiKey,
      },
      timeout: REQUEST_TIMEOUT_MS,
    });

    return response.data.map((result) => ({
      name: result.name,
      state: result.state,
      country: result.country,
      lat: result.lat,
      lon: result.lon,
    }));
  } catch {
    throw new AppError(502, 'Unable to reach the geocoding service. Please try again later.');
  }
}
