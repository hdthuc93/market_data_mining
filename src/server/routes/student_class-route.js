import express from 'express';
import student_classCtrl from '../controllers/student_class-controller';
import validation from '../middlewares/validation'


const router = express.Router();

router.route('/')
    .get(
        student_classCtrl.getStuInClass
    )
    .post(
        student_classCtrl.addStuInClass
    )

router.route('/del')
    .post(
        student_classCtrl.delStuInClass
    )
    


export default router;