import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env, isProduction } from './config/env';
import apiV1Routes from './routes';
import healthRoutes from './routes/health.routes';
import { apiRateLimiter } from './middlewares/rateLimiter.middleware';
import { notFound } from './middlewares/notFound.middleware';
import { errorHandler } from './middlewares/errorHandler.middleware';

const API_V1_PREFIX = '/api/v1';

export function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());
  app.use(morgan(isProduction ? 'combined' : 'dev'));

  app.get('/', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      message: 'Weather Dashboard API is running.',
      endpoints: {
        health: '/api/health',
        weather: `${API_V1_PREFIX}/weather?city=London`,
        cities: `${API_V1_PREFIX}/cities?q=Lon`,
      },
    });
  });

  // Infra/monitoring endpoint — intentionally unversioned and outside the rate limiter.
  app.use('/api', healthRoutes);

  app.use(API_V1_PREFIX, apiRateLimiter, apiV1Routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
