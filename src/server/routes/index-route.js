import express from 'express';
import infoRoute from './info-route';

const router = express.Router();

router.use('/info', infoRoute);

export default router;