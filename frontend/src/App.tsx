import { useEffect } from 'react';
import { AppBackground } from './components/layout/AppBackground';
import { SearchBar } from './components/SearchBar/SearchBar';
import { WeatherCard } from './components/WeatherCard/WeatherCard';
import { LoadingState } from './components/LoadingState/LoadingState';
import { ErrorState } from './components/ErrorState/ErrorState';
import { useWeather } from './hooks/useWeather';
import { getBackgroundVariant } from './utils/getBackgroundVariant';

function App() {
  const { state, search, searchByCoordinates } = useWeather();
  const backgroundVariant = getBackgroundVariant(
    state.status === 'success' ? state.data.temperature : undefined,
  );

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    function requestLocation(isRetry: boolean) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          searchByCoordinates(position.coords.latitude, position.coords.longitude, {
            silent: true,
          });
        },
        (error) => {
          const isRecoverable =
            error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE;
          if (isRecoverable && !isRetry) {
            requestLocation(true);
          }
        },
        { timeout: 15000, maximumAge: 300000 },
      );
    }

    requestLocation(false);
  }, [searchByCoordinates]);

  return (
    <AppBackground variant={backgroundVariant}>
      <SearchBar onSearch={search} isLoading={state.status === 'loading'} />

      {state.status === 'idle' && (
        <p className="text-center text-white/90 drop-shadow">
          Search for a city to see the current weather.
        </p>
      )}
      {state.status === 'loading' && <LoadingState />}
      {state.status === 'error' && <ErrorState message={state.message} />}
      {state.status === 'success' && <WeatherCard data={state.data} />}
    </AppBackground>
  );
}

export default App;
