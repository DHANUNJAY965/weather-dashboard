import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { searchCities } from '../services/geocoding.service';
import { CitySuggestion } from '../types/geocoding.types';
import { SuccessResponse } from '../types/weather.types';

export const getCitySuggestions = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query.q as string;

  const data = await searchCities(query);

  const response: SuccessResponse<CitySuggestion[]> = { success: true, data };
  res.status(200).json(response);
});
