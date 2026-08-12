import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { getWeatherByCity, getWeatherByCoordinates } from '../services/weather.service';
import { SuccessResponse, WeatherData } from '../types/weather.types';

export const getWeather = asyncHandler(async (req: Request, res: Response) => {
  const city = req.query.city as string | undefined;

  const data =
    city !== undefined
      ? await getWeatherByCity(city)
      : await getWeatherByCoordinates(Number(req.query.lat), Number(req.query.lon));

  const response: SuccessResponse<WeatherData> = { success: true, data };
  res.status(200).json(response);
});
