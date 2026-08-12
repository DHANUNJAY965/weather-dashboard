export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface CitySuggestion {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}
