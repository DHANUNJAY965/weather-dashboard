import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    // eslint-disable-next-line no-console
    console.error(`[config] Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

export const env = Object.freeze({
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  openWeatherApiKey: requireEnv('OPENWEATHER_API_KEY'),
  openWeatherBaseUrl:
    process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5/weather',
  cacheTtlSeconds: Number(process.env.CACHE_TTL_SECONDS) || 600,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
});

export const isProduction = env.nodeEnv === 'production';
