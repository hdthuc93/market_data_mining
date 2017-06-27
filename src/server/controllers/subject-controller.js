import { sequelize, Sequelize } from '../models/index';
import DiemMH from '../models/diemmh-model';
import HocSinh_LopHoc from '../models/hocsinh_lophoc-model';
import HocSinh from '../models/hocsinh-model';
import QuyDinh from '../models/quydinh-model';
import MonHoc from '../models/monhoc-model';
import commonObj from '../utilities/common_object';

function addScores(req, res) {
    let upsertArr = [];
    try{
        const len = req.body.listScores.length;
        for(let i = 0; i < len; ++i) {
            upsertArr[i] = {
                maMonHoc: req.body.subjectID,
                maHocKy: req.body.semesterID,
                maLopHoc: req.body.classID,
                maHocSinh: req.body.listScores[i].studentID,
                diem_15phut: req.body.listScores[i].score1,
                diem_1tiet: req.body.listScores[i].score2,
                diemCuoiKy: req.body.listScores[i].score3
            };
        }
    } catch(ex) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to insert or update score(s)"
        });
    }

    DiemMH.bulkCreate(upsertArr, {
        updateOnDuplicate: ['diem_15phut', 'diem_1tiet', 'diemCuoiKy']
    })
    .then((result) => {
        return res.status(200).json({
            success: true,
            message: "Insert or update score(s) successfully"
        });
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to insert or update score(s)"
        });
    });
}

async function addAllSubjectInClass(classID, studentList) {
    let subjectList = await MonHoc.findAll({ where: { maNamHoc: commonObj.schoolYearID } });

    for(let i = 0; i < subjectList.length; ++i) {
        for(let j = 0; j < studentList.length; ++j) {
            try {
                await DiemMH.create({
                    maMonHoc: subjectList[i].monHoc_pkey,
                    maHocKy: 1,
                    maLopHoc: classID,
                    maHocSinh: studentList[j]
                });

                await DiemMH.create({
                    maMonHoc: subjectList[i].monHoc_pkey,
                    maHocKy: 2,
                    maLopHoc: classID,
                    maHocSinh: studentList[j]
                })
            } catch(ex) {
                console.log(ex);
                continue;
            }
        }
    }
}

function getScores(req, res) {
    const reqParams = {
        maHocKy: req.query.semesterID || 'DIEM.MA_HOC_KI',
        maLopHoc: req.query.classID || 'HS_LOP.MA_LOP_HOC',
        maMonHoc: req.query.subjectID || 'MH.MON_HOC_PKEY',
        maHocSinh: req.query.studentID || 'HS.HOC_SINH_PKEY'
    }

    let queryStr = `SELECT HS.HOC_SINH_PKEY as studentID,
                            HS.HO_TEN as studentName,
                            HS_LOP.MA_LOP_HOC as classID,
                            MH.MON_HOC_PKEY as subjectID,
                            MH.TEN_MON_HOC as subjectName,
                            DIEM.MA_HOC_KI as semesterID,
                            DIEM.DIEM_15_PHUT as score1,
                            DIEM.DIEM_1_TIET as score2,
                            DIEM.DIEM_CUOI_KI as score3,
                            DIEM.TONG_DIEM as totalScore
                    FROM AE_HOC_SINH as HS, HOCSINH_LOPHOC as HS_LOP, AE_DIEM_MON_HOC as DIEM, M_MON_HOC as MH
                    WHERE HS_LOP.MA_HOC_SINH = DIEM.MA_HOC_SINH AND
                            HS_LOP.MA_LOP_HOC = DIEM.MA_LOP_HOC AND
                            HS.HOC_SINH_PKEY = HS_LOP.MA_HOC_SINH AND
                            DIEM.MA_MON_HOC = MH.MON_HOC_PKEY AND
                            DIEM.MA_HOC_KI = ${reqParams.maHocKy} AND
                            HS_LOP.MA_LOP_HOC = ${reqParams.maLopHoc} AND
                            HS.HOC_SINH_PKEY = ${reqParams.maHocSinh} AND 
                            MH.MON_HOC_PKEY = ${reqParams.maMonHoc}
                    ORDER BY MH.MON_HOC_PKEY ASC;`;
    
    sequelize.query(queryStr)
    .spread((results, metadata) => {
        const len = results.length;
        let prevSubjectID = -1;

        let objReturning = {
            semesterID: Number(req.query.semesterID),
            classID: Number(req.query.classID),
            list: []
        }

        for(let i = 0; i < len; ++i) {
            let lenList = objReturning.list.length;
            let studentInfo = {
                studentID: results[i].studentID,
                studentName: results[i].studentName,
                score1: results[i].score1 || '',
                score2: results[i].score2 || '',
                score3: results[i].score3 || '',
                totalScore: results[i].totalScore || ''
            }

            if(prevSubjectID == results[i].subjectID) {
                let lenListScores = objReturning.list[lenList - 1].listScores.length;

                objReturning.list[lenList - 1].listScores[lenListScores] = studentInfo;
            } else {
                objReturning.list[lenList] = {
                    subjectID: results[i].subjectID,
                    subjectName: results[i].subjectName,
                    listScores: [ studentInfo ]
                }
            }

            prevSubjectID = results[i].subjectID;
        }

        return res.status(200).json({
            success: true,
            message: "Get score(s) successfully",
            datas: objReturning
        });
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to get score(s)"
        });
    });
}

async function addSubjects(schoolYearID) {
    let result = await QuyDinh.findOne({
        where: { maNamHoc: schoolYearID }
    });
    
    let arrSubjects = JSON.parse(result.dsMonHoc);
    arrSubjects = arrSubjects.course;
    let arrIns = []
    arrSubjects.forEach((element) => {
        arrIns[arrIns.length] = {
            tenMonHoc: element.courseName,
            maNamHoc: schoolYearID
        }
    });

    MonHoc.bulkCreate(arrIns);
}

function getSubjects(req, res) {
    MonHoc.findAll({ where: { maNamHoc: commonObj.schoolYearID } })
    .then((result) => {
        const len = result.length;

        let objReturning = [];
        for(let i = 0; i < len; ++i) {
            objReturning[objReturning.length] = {
                subjectID: result[i].monHoc_pkey,
                subjectName: result[i].tenMonHoc,
                schoolYearID: result[i].maNamHoc
            }
        }

        return res.status(200).json({
            success: true,
            message: "Get subject successfully",
            datas: objReturning
        });
    })
    .catch((err) => {
        return res.status(500).json({
            success: false,
            message: "Failed to get subject"
        });
    });
}

function summary(req, res) {
    const inputClassID = req.body.classID;
    const inputSemesterID = req.body.semesterID;
    DiemMH.update({ tongDiem: sequelize.literal('(DIEM_15_PHUT + DIEM_1_TIET*2 + DIEM_CUOI_KI*3) / 6') }, {
        where: { 
            maHocKy: inputSemesterID,
            maLopHoc: inputClassID,
            diem_15phut: { $ne: null },
            diem_1tiet: { $ne: null },
            diemCuoiKy: { $ne: null }
        }
    })
    .then( async (result) => {
        if(result[0] > 0) {
            let subjectCount = await MonHoc.findAndCountAll({
                                    where: { maNamHoc: commonObj.schoolYearID }
                                });
            subjectCount = subjectCount.count;

            HocSinh_LopHoc.findAll({
                where: { maLopHoc: inputClassID }
            })
            .then( async (result) => {
                for(let i = 0; i < result.length; ++i) {
                    const subjects = await DiemMH.findAll({ 
                                        where: { 
                                            maLopHoc: inputClassID,
                                            maHocKy: inputSemesterID,
                                            maHocSinh: result[i].maHocSinh
                                        } 
                                    });
                    
                    let tongHK = 0;
                    for(let j = 0; j < subjects.length; ++j) {
                        tongHK += subjects[i].tongDiem || 0;
                    }
                    tongHK = tongHK / subjectCount;

                    if(inputSemesterID == 1)
                        await HocSinh_LopHoc.update({ tongHK1: tongHK }, {
                            where: {
                                maLopHoc: inputClassID,
                                maHocSinh: result[i].maHocSinh
                            }
                        });
                    else {
                        let tongCaNam = (result[i].tongHK1 || 0 + tongHK*2) / 3;
                        let passed = tongCaNam < commonObj.minScore ? false : true; 
                        await HocSinh_LopHoc.update({ tongHK2: tongHK, tongCaNam: tongCaNam, passed: passed }, {
                            where: {
                                maLopHoc: inputClassID,
                                maHocSinh: result[i].maHocSinh
                            }
                        });

                        if(passed)
                            await HocSinh.update({ trinhDo: sequelize.literal('trinhDo + 1') }, {
                                where: {
                                    hocSinh_pkey: result[i].maHocSinh
                                }
                            });
                    }
                }
            })
        }
        return res.status(200).json({
            success: true,
            message: "Summary semester in school year is successfully"
        });
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to summary semester in school year"
        });
    })
}

export default { addScores, getScores, addSubjects, getSubjects, summary, addAllSubjectInClass };