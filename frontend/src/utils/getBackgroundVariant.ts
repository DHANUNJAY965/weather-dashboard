import { BACKGROUND_IMAGES, WARM_TEMPERATURE_THRESHOLD_CELSIUS } from '../constants/weather';

export type BackgroundVariant = keyof typeof BACKGROUND_IMAGES;

export function getBackgroundVariant(temperature?: number): BackgroundVariant {
  if (temperature === undefined) {
    return 'default';
  }
  return temperature >= WARM_TEMPERATURE_THRESHOLD_CELSIUS ? 'warm' : 'cool';
}
