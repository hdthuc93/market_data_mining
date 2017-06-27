import express from 'express';
import studentCtrl from '../controllers/student-controller';
import validation from '../middlewares/validation'


const router = express.Router();

router.route('/')
    .get(
        studentCtrl.searchStudents
    )
    .post(
        studentCtrl.createStu
    )
    .put(
        studentCtrl.updateStu
    )
    .delete(
        studentCtrl.deleteStu
    );
    


export default router;