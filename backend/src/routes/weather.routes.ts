import { Router } from 'express';
import { getWeather } from '../controllers/weather.controller';
import { validateWeatherQuery } from '../validators/weather.validator';

const router = Router();

router.get('/weather', validateWeatherQuery, getWeather);

export default router;
