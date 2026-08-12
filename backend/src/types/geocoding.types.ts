export interface OpenWeatherGeocodingResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface CitySuggestion {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}
