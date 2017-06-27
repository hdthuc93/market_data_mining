import express from 'express';
import subjectCtrl from '../controllers/subject-controller';
import validation from '../middlewares/validation'


const router = express.Router();

router.route('/')
    .get(
        subjectCtrl.getSubjects
    );

router.route('/score')
    .get(
        subjectCtrl.getScores
    )
    .post(
        subjectCtrl.addScores
    );

router.route('/summary')
    .post(
        subjectCtrl.summary
    )

export default router;