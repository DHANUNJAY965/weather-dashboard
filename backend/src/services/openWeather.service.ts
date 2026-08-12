import axios, { AxiosError } from 'axios';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { OpenWeatherApiResponse } from '../types/weather.types';

const REQUEST_TIMEOUT_MS = 5000;

export function fetchCurrentWeatherByCity(city: string): Promise<OpenWeatherApiResponse> {
  return requestCurrentWeather({ q: city }, city);
}

export function fetchCurrentWeatherByCoordinates(
  lat: number,
  lon: number,
): Promise<OpenWeatherApiResponse> {
  return requestCurrentWeather({ lat, lon });
}

async function requestCurrentWeather(
  locationParams: Record<string, string | number>,
  city?: string,
): Promise<OpenWeatherApiResponse> {
  try {
    const response = await axios.get<OpenWeatherApiResponse>(env.openWeatherBaseUrl, {
      params: {
        ...locationParams,
        appid: env.openWeatherApiKey,
        units: 'metric',
      },
      timeout: REQUEST_TIMEOUT_MS,
    });

    return response.data;
  } catch (error) {
    throw mapOpenWeatherError(error, city);
  }
}

function mapOpenWeatherError(error: unknown, city?: string): AppError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    if (axiosError.code === 'ECONNABORTED') {
      return new AppError(504, 'Weather service timed out. Please try again.');
    }

    const status = axiosError.response?.status;

    if (status === 404) {
      return new AppError(404, city ? `City "${city}" not found.` : 'Location not found.');
    }

    if (status === 401) {
      return new AppError(502, 'Weather service rejected the request credentials.');
    }

    return new AppError(502, 'Unable to reach the weather service. Please try again later.');
  }

  return new AppError(502, 'Unexpected error while contacting the weather service.');
}
