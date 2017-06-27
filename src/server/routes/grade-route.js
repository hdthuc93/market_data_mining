import express from 'express';
import gradeCtrl from '../controllers/grade-controller';
import validation from '../middlewares/validation'


const router = express.Router();

router.route('/')
    .get(
        gradeCtrl.getGrade
    )

export default router;