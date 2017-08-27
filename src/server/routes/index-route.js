import express from 'express';
import infoRoute from './info-route';
import itemRoute from './item-route';
import statisticRoute from './statistic-route';
import invoiceRoute from './invoice-route';

const router = express.Router();

router.use('/info', infoRoute);
router.use('/item', itemRoute);
router.use('/statistic', statisticRoute);
router.use('/invoice', invoiceRoute);

export default router;