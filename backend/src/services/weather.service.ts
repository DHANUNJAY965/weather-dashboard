import { fetchCurrentWeatherByCity, fetchCurrentWeatherByCoordinates } from './openWeather.service';
import { buildCacheKey, getCached, setCached } from './cache.service';
import { OpenWeatherApiResponse, WeatherData } from '../types/weather.types';

const METERS_PER_SECOND_TO_KMH = 3.6;
const COORDINATE_CACHE_PRECISION = 2;

export async function getWeatherByCity(city: string): Promise<WeatherData> {
  const cacheKey = buildCacheKey('weather', city);

  const cached = getCached<WeatherData>(cacheKey);
  if (cached) {
    return cached;
  }

  const raw = await fetchCurrentWeatherByCity(city);
  const normalized = normalizeWeatherData(raw);

  setCached(cacheKey, normalized);

  return normalized;
}

export async function getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData> {
  const cacheKey = buildCacheKey(
    'weather-coords',
    `${lat.toFixed(COORDINATE_CACHE_PRECISION)},${lon.toFixed(COORDINATE_CACHE_PRECISION)}`,
  );

  const cached = getCached<WeatherData>(cacheKey);
  if (cached) {
    return cached;
  }

  const raw = await fetchCurrentWeatherByCoordinates(lat, lon);
  const normalized = normalizeWeatherData(raw);

  setCached(cacheKey, normalized);

  return normalized;
}

function normalizeWeatherData(raw: OpenWeatherApiResponse): WeatherData {
  const [conditions] = raw.weather;

  return {
    city: `${raw.name}, ${raw.sys.country}`,
    temperature: Math.round(raw.main.temp),
    condition: toTitleCase(conditions?.description ?? conditions?.main ?? 'Unknown'),
    humidity: raw.main.humidity,
    windSpeed: Math.round(raw.wind.speed * METERS_PER_SECOND_TO_KMH * 10) / 10,
    icon: conditions?.icon ?? '01d',
  };
}

function toTitleCase(value: string): string {
  return value
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
