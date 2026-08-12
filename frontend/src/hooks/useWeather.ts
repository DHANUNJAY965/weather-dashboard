import { useCallback, useReducer, useRef } from 'react';
import { getWeatherByCity, getWeatherByCoordinates } from '../api/weatherApi';
import { ApiError } from '../api/client';
import { WeatherData } from '../types/weather.types';

type WeatherState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: WeatherData }
  | { status: 'error'; message: string };

type WeatherAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: WeatherData }
  | { type: 'FETCH_ERROR'; message: string }
  | { type: 'RESET' };

function weatherReducer(_state: WeatherState, action: WeatherAction): WeatherState {
  switch (action.type) {
    case 'FETCH_START':
      return { status: 'loading' };
    case 'FETCH_SUCCESS':
      return { status: 'success', data: action.payload };
    case 'FETCH_ERROR':
      return { status: 'error', message: action.message };
    case 'RESET':
      return { status: 'idle' };
  }
}

interface RunOptions {
  /** When true, a failure resets to idle instead of showing an error (used for the automatic geolocation lookup). */
  silent?: boolean;
}

export function useWeather() {
  const [state, dispatch] = useReducer(weatherReducer, { status: 'idle' });
  const abortControllerRef = useRef<AbortController | null>(null);

  const run = useCallback(
    async (fetchWeather: (signal: AbortSignal) => Promise<WeatherData>, options?: RunOptions) => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      dispatch({ type: 'FETCH_START' });

      try {
        const data = await fetchWeather(controller.signal);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        if (options?.silent) {
          dispatch({ type: 'RESET' });
          return;
        }

        const message =
          error instanceof ApiError ? error.message : 'Something went wrong. Please try again.';
        dispatch({ type: 'FETCH_ERROR', message });
      }
    },
    [],
  );

  const search = useCallback(
    (city: string) => run((signal) => getWeatherByCity(city, signal)),
    [run],
  );

  const searchByCoordinates = useCallback(
    (lat: number, lon: number, options?: RunOptions) =>
      run((signal) => getWeatherByCoordinates(lat, lon, signal), options),
    [run],
  );

  return { state, search, searchByCoordinates };
}
