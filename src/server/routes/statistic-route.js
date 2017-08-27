import express from 'express';
import statisticCtrl from '../controllers/statistic-controller';


const router = express.Router();

router.route('/')
    .get(statisticCtrl.getCommonStatistic)
    
export default router;