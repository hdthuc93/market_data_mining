import express from 'express';
import userRoutes from './user-route';
import studentRoutes from './student-route';
import classRoutes from './class-route';
import student_classRoutes from './student_class-route';
import subjectRoutes from './subject-route';
import gradeRoutes from './grade-route';
import semesterRoutes from './semester-route';
import schoolYearRoutes from './school_year-route';
import regulationRoutes from './regulation-route';
import statisticRoutes from './statistic-route';
import auth from '../middlewares/authentication';
import { generateStudentID } from '../utilities/id_generates';
import commonObj from '../utilities/common_object';

const router = express.Router();

router.use('/user', userRoutes);

router.use('/*', (req, res, next) => {
    next();
});


router.use('/student', studentRoutes);
router.use('/class', classRoutes);
router.use('/student_class', student_classRoutes);
router.use('/subject', subjectRoutes);
router.use('/school_year', schoolYearRoutes);
router.use('/grade', gradeRoutes);
router.use('/semester', semesterRoutes);
router.use('/regulation', regulationRoutes)
router.use('/statistic', statisticRoutes)

export default router;