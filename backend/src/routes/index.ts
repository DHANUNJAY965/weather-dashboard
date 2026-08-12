import { Router } from 'express';
import weatherRoutes from './weather.routes';
import geocodingRoutes from './geocoding.routes';

const router = Router();

router.use(weatherRoutes);
router.use(geocodingRoutes);

export default router;
