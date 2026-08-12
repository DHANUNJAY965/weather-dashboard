import { Router } from 'express';
import weatherRoutes from './weather.routes';
import geocodingRoutes from './geocoding.routes';
import healthRoutes from './health.routes';

const router = Router();

router.use(healthRoutes);
router.use(weatherRoutes);
router.use(geocodingRoutes);

export default router;
