import express from 'express';
import infoRoute from './info-route';
import itemRoute from './item-route';

const router = express.Router();

router.use('/info', infoRoute);
router.use('/item', itemRoute);

export default router;