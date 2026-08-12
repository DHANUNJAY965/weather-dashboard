import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';

const MIN_QUERY_LENGTH = 2;
const MAX_QUERY_LENGTH = 100;

export function validateCitySearchQuery(req: Request, _res: Response, next: NextFunction): void {
  const rawQuery = req.query.q;

  if (typeof rawQuery !== 'string' || rawQuery.trim().length < MIN_QUERY_LENGTH) {
    return next(
      new AppError(400, `Query parameter "q" must be at least ${MIN_QUERY_LENGTH} characters.`),
    );
  }

  const query = rawQuery.trim();

  if (query.length > MAX_QUERY_LENGTH) {
    return next(new AppError(400, 'Query is too long.'));
  }

  req.query.q = query;
  next();
}
