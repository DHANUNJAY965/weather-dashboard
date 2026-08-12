import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { ErrorResponse } from '../types/weather.types';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    const response: ErrorResponse = { success: false, message: err.message };
    res.status(err.statusCode).json(response);
    return;
  }

  // eslint-disable-next-line no-console
  console.error('[unhandled error]', err);

  const response: ErrorResponse = { success: false, message: 'Internal server error.' };
  res.status(500).json(response);
}
