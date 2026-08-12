import { Router } from 'express';
import { getCitySuggestions } from '../controllers/geocoding.controller';
import { validateCitySearchQuery } from '../validators/citySearch.validator';

const router = Router();

router.get('/cities', validateCitySearchQuery, getCitySuggestions);

export default router;
