import express from 'express';
import infoRoute from './info-route';
import itemRoute from './item-route';
import statisticRoute from './statistic-route';

const router = express.Router();

router.use('/info', infoRoute);
router.use('/item', itemRoute);
router.use('/statistic', statisticRoute);

export default router;