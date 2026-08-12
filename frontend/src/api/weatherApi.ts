import { apiGet } from './client';
import { WeatherData } from '../types/weather.types';

export function getWeatherByCity(city: string, signal?: AbortSignal): Promise<WeatherData> {
  return apiGet<WeatherData>(`/weather?city=${encodeURIComponent(city)}`, signal);
}

export function getWeatherByCoordinates(
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<WeatherData> {
  return apiGet<WeatherData>(`/weather?lat=${lat}&lon=${lon}`, signal);
}
