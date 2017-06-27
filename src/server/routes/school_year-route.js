import express from 'express';
import schoolYearCtrl from '../controllers/school_year-controller';
import validation from '../middlewares/validation'


const router = express.Router();

router.route('/')
    .get(
        schoolYearCtrl.getSchoolYear
    )
    .post(
        schoolYearCtrl.addNewSchoolYear
    );

router.route('/change')
    .post(
        schoolYearCtrl.changeSchoolYear
    );

router.route('/future')
    .get(
        schoolYearCtrl.getFutureSchoolYear
    );

export default router;