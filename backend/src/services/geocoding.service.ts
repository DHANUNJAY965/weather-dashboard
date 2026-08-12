import axios from 'axios';
import { AppError } from '../utils/AppError';
import { buildCacheKey, getCached, setCached } from './cache.service';
import { CitySuggestion, PhotonResponse } from '../types/geocoding.types';

const GEOCODING_URL = 'https://photon.komoot.io/api/';
const RAW_RESULT_LIMIT = 10;
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
    const response = await axios.get<PhotonResponse>(GEOCODING_URL, {
      params: {
        q: query,
        limit: RAW_RESULT_LIMIT,
        lang: 'en',
      },
      headers: {
        'User-Agent': 'weather-dashboard-app',
      },
      timeout: REQUEST_TIMEOUT_MS,
    });

    return normalizeSuggestions(response.data.features);
  } catch {
    throw new AppError(502, 'Unable to reach the geocoding service. Please try again later.');
  }
}

function normalizeSuggestions(features: PhotonResponse['features']): CitySuggestion[] {
  const suggestions: CitySuggestion[] = [];
  const seen = new Set<string>();

  for (const feature of features) {
    const { properties, geometry } = feature;

    if (properties.osm_key !== 'place' || !properties.name || !properties.countrycode) {
      continue;
    }

    const dedupeKey = `${properties.name}|${properties.state ?? ''}|${properties.countrycode}`;
    if (seen.has(dedupeKey)) {
      continue;
    }
    seen.add(dedupeKey);

    suggestions.push({
      name: properties.name,
      state: properties.state,
      country: properties.countrycode,
      lat: geometry.coordinates[1],
      lon: geometry.coordinates[0],
    });

    if (suggestions.length === SUGGESTION_LIMIT) {
      break;
    }
  }

  return suggestions;
}
