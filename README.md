# Weather Dashboard

Search current weather by city. The frontend never talks to OpenWeather directly — it calls this repo's own backend, which holds the OpenWeather API key and proxies/normalizes/caches the upstream response.

**Live:**

- App: https://weather-dashboard-styldod.vercel.app
- API: https://weather-dashboard-styldod-api.vercel.app

```
Styldod/
  backend/    Express + TypeScript API (proxies OpenWeather, caches, validates)
  frontend/   Vite + React + TypeScript + Tailwind UI
```

## Features

- Search weather by city name
- Displays city, temperature, weather condition, humidity, wind speed, and the weather icon
- City autocomplete — suggests matching cities as you type (debounced, keyboard navigable), backed by OpenWeather's geocoding API
- Auto-detects your location on load and shows weather for where you are by default, no search needed
- Background photo shifts warm/cool based on the current temperature
- Loading and error states for every request
- Backend-side response caching and rate limiting to avoid hammering the OpenWeather API
- OpenWeather API key lives only on the backend — the frontend never talks to OpenWeather directly

## Setup

```bash
npm run install:all      # installs both backend/ and frontend/ dependencies
```

Each package has its own `.env` (already populated for local dev; `.env.example` documents the shape):

- `backend/.env` — `OPENWEATHER_API_KEY`, `PORT`, `CORS_ORIGIN`, `CACHE_TTL_SECONDS`, etc.
- `frontend/.env` — `VITE_API_BASE_URL` (defaults to `http://localhost:5000/api`).

## Run

```bash
npm run dev               # runs backend (:5000) and frontend (:5173) together
```

Or individually: `npm run dev:backend` / `npm run dev:frontend`.

Open http://localhost:5173.

## API

- `GET /api/health` → `{ "status": "ok" }`
- `GET /api/weather?city=London` → `{ "success": true, "data": { "city", "temperature", "condition", "humidity", "windSpeed", "icon" } }`
- Errors → `{ "success": false, "message": "..." }` with an appropriate HTTP status (400 invalid input, 404 city not found, 502/504 upstream failure).

## Build

```bash
npm run build              # builds both packages
```
