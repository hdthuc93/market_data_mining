import express from 'express';
import userCtrl from '../controllers/user-controller';
import validation from '../middlewares/validation'

const router = express.Router();

router.route('/register')
    .post(
        validation.register,
        userCtrl.register
    );

router.route('/login')
    .post(
        userCtrl.login
    );

export default router;