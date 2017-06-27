import express from 'express';
import classCtrl from '../controllers/class-controller';
import validation from '../middlewares/validation'


const router = express.Router();

router.route('/')
    .get(
        classCtrl.getClass
    )

export default router;