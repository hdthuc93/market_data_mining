import express from 'express';
import regulationCtrl from '../controllers/regulation-controller';
import validation from '../middlewares/validation'


const router = express.Router();

router.route('/')
    .get(
        regulationCtrl.getRegulation
    );

router.route('/update')
    .post(
        regulationCtrl.updateRegulation
    );

export default router;