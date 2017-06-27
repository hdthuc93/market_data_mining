import ThongKeMon from '../models/thongke_mon-model';
import ThongKeHK from '../models/thongke_hk-model';
import DiemMH from '../models/diemmh-model';
import LopHoc from '../models/lophoc-model';
import MonHoc from '../models/monhoc-model';
import HocSinh_LopHoc from '../models/hocsinh_lophoc-model';
import commonObj from '../utilities/common_object';

async function createSubjectStatistic(req, res) {
    const subjectID = req.query.subjectID;
    const semesterID = req.query.semesterID;

    let inputData = [];

    let classList = await LopHoc.findAll({
        where: { maNamHoc: commonObj.schoolYearID }
    });

    for(let i = 0; i < classList.length; ++i) {
        inputData[i] = {
            maMonHoc: subjectID,
            maLopHoc: classList[i].maLop_pkey,
            maHocKy: semesterID,
            siSo: 0,
            slDat: 0,
            tyLe: 0,
        };

        let scoreResult = await DiemMH.findAndCountAll({ 
            where: {
                maMonHoc: subjectID,
                maHocKy: semesterID,
                maLopHoc: classList[i].maLop_pkey,
                tongDiem: { $gte: commonObj.minScore }
            }   
        });

        inputData[i].slDat = scoreResult.count;
        inputData[i].siSo = classList[i].siSo;
        inputData[i].tyLe = (inputData[i].slDat / inputData[i].siSo) || 0.0;
    }
        

    ThongKeMon.bulkCreate(inputData, {
        updateOnDuplicate: ['siSo', 'slDat', 'tyLe']
    })
    .then((result) => {
        return getSubjectStatistic(req, res, subjectID, semesterID);
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to create subject statistic"
        });
    })
}

function getSubjectStatistic(req, res, subjectID, semesterID) {
    
    let objReturning = {
        semesterID: semesterID,
        subjectID: subjectID,
    };

    ThongKeMon.findAll({
        where: {
            maMonHoc: subjectID,
            maHocKy: semesterID
        },
        include: [{
            model: MonHoc
        }, {
            model: LopHoc,
            where: {
                maNamHoc: commonObj.schoolYearID
            }
        }]
    })
    .then((results) => {
        
        let len = results.length;
        if(len > 0) {
            objReturning.subjectName = results[0]['M_MON_HOC'].tenMonHoc;

            objReturning.list = [];
            for(let i = 0; i < len; ++i) {
                objReturning.list[objReturning.list.length] = {
                    classID: results[i].maLopHoc,
                    className: results[i]['M_LOP_HOC'].tenLop,
                    numOfStudents: results[i].siSo,
                    numOfPass: results[i].slDat,
                    ratio: results[i].tyLe
                }
            }

            return res.status(200).json({
                success: true,
                message: "Get subject statistic successfully",
                data: objReturning
            });
        }
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to get subject statistic"
        });
    })
}

async function createSemesterStatistic(req, res) {
    const semesterID = req.query.semesterID;

    let classList = await LopHoc.findAll({
        where: { maNamHoc: commonObj.schoolYearID }
    });
    let inputData = [];
    for(let i = 0; i < classList.length; ++i) {
        inputData[i] = {
            maLopHoc: classList[i].maLop_pkey,
            maHocKy: semesterID,
            siSo: 0,
            slDat: 0,
            tyLe: 0,
        }

        let objCondition = {
            maLopHoc: classList[i].maLop_pkey,
        }

        if(semesterID == 1)
            objCondition.tongHK1 = { $gte: commonObj.minScore };
        else
            objCondition.tongHK2 = { $gte: commonObj.minScore };

        let hs_lopResult = await HocSinh_LopHoc.findAndCountAll({ 
            where: objCondition
        });
       
        inputData[i].slDat = hs_lopResult.count;
        let lopHocResult = await LopHoc.findOne({ where: { maLop_pkey: classList[i].maLop_pkey } });
        inputData[i].siSo = lopHocResult.siSo;
        inputData[i].tyLe = (inputData[i].slDat / inputData[i].siSo) || 0.0;
    }

    ThongKeHK.bulkCreate(inputData, {
        updateOnDuplicate: ['siSo', 'slDat', 'tyLe']
    })
    .then((result) => {
        return getSemesterStatistic(req, res, semesterID);
    })
    .catch((err) => {
        return res.status(500).json({
            success: false,
            message: "Something wrong when create semester statistic"
        });
    })
}

function getSemesterStatistic(req, res, semesterID) {
    let objReturning = {
        semesterID: semesterID,
    };

    ThongKeHK.findAll({
        where: {
            maHocKy: semesterID
        },
        include: [{
            model: LopHoc,
            where: {
                maNamHoc: commonObj.schoolYearID
            }
        }]
    })
    .then((results) => {
        let len = results.length;

        if(len > 0) {
            objReturning.list = [];
            for(let i = 0; i < len; ++i) {
                objReturning.list[objReturning.list.length] = {
                    classID: results[i].maLopHoc,
                    className: results[i]['M_LOP_HOC'].tenLop,
                    numOfStudents: results[i].siSo,
                    numOfPass: results[i].slDat,
                    ratio: results[i].tyLe
                }
            }

            return res.status(200).json({
                success: true,
                message: "Get semester statistic successfully",
                data: objReturning
            });
        }
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to get semester statistic"
        });
    })
}

export default { createSubjectStatistic, getSubjectStatistic, createSemesterStatistic, getSemesterStatistic };