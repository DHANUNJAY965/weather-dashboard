import { WEATHER_ICON_BASE_URL } from '../constants/weather';

export function getWeatherIconUrl(icon: string): string {
  return `${WEATHER_ICON_BASE_URL}/${icon}@2x.png`;
}
