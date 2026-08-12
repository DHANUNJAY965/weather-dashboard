import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env, isProduction } from './config/env';
import apiRoutes from './routes';
import { apiRateLimiter } from './middlewares/rateLimiter.middleware';
import { notFound } from './middlewares/notFound.middleware';
import { errorHandler } from './middlewares/errorHandler.middleware';

export function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());
  app.use(morgan(isProduction ? 'combined' : 'dev'));

  app.use('/api', apiRateLimiter, apiRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
