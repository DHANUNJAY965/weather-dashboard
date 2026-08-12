import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';

const CITY_NAME_PATTERN = /^[\p{L}\s'\-.,]+$/u;
const MAX_CITY_LENGTH = 100;

export function validateWeatherQuery(req: Request, _res: Response, next: NextFunction): void {
  const { city, lat, lon } = req.query;

  if (typeof city === 'string' && city.trim().length > 0) {
    return validateCity(city, req, next);
  }

  if (lat !== undefined || lon !== undefined) {
    return validateCoordinates(lat, lon, req, next);
  }

  next(new AppError(400, 'Provide either a "city" query parameter or "lat" and "lon" coordinates.'));
}

function validateCity(rawCity: string, req: Request, next: NextFunction): void {
  const city = rawCity.trim();

  if (city.length > MAX_CITY_LENGTH) {
    return next(new AppError(400, 'City name is too long.'));
  }

  if (!CITY_NAME_PATTERN.test(city)) {
    return next(new AppError(400, 'City name contains invalid characters.'));
  }

  req.query.city = city;
  next();
}

function validateCoordinates(
  rawLat: unknown,
  rawLon: unknown,
  req: Request,
  next: NextFunction,
): void {
  if (typeof rawLat !== 'string' || typeof rawLon !== 'string') {
    return next(new AppError(400, 'Both "lat" and "lon" query parameters are required.'));
  }

  const lat = Number(rawLat);
  const lon = Number(rawLon);

  if (Number.isNaN(lat) || lat < -90 || lat > 90) {
    return next(new AppError(400, '"lat" must be a number between -90 and 90.'));
  }

  if (Number.isNaN(lon) || lon < -180 || lon > 180) {
    return next(new AppError(400, '"lon" must be a number between -180 and 180.'));
  }

  req.query.lat = String(lat);
  req.query.lon = String(lon);
  next();
}
