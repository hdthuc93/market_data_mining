import express from 'express';
import semesterCtrl from '../controllers/semester-controller';
import validation from '../middlewares/validation'


const router = express.Router();

router.route('/')
    .get(
        semesterCtrl.getSemester
    )

export default router;