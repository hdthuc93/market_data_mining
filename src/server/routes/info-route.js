import express from 'express';
import infoCtrl from '../controllers/info-controller';


const router = express.Router();

router.route('/')
    .get(
        infoCtrl.getInfo
    )

export default router;