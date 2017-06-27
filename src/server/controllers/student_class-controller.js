import { sequelize, Sequelize } from '../models/index';
import HocSinh_LopHoc from '../models/hocsinh_lophoc-model';
import HocSinh from '../models/hocsinh-model';
import LopHoc from '../models/lophoc-model';
import DiemMH from '../models/diemmh-model';
import subjectCtrl from './subject-controller';
import { changeToDDMMYYYY } from '../utilities/date_times';

async function canAdd(studentList, classID) {
    let cls = await LopHoc.findOne({ where: { maLop_pkey: classID } });

    for(let i = 0; i < studentList.length; ++i) {
        let stu = await HocSinh.findOne({ where: { hocSinh_pkey: studentList[i] }});
        console.log(stu.inClass, cls.maKhoi, stu.trinhDo);
        if(stu.inClass || cls.maKhoi != stu.trinhDo)
            return false;
    }
    return true;
}

async function addStuInClass(req, res) {
    const studentList = req.body.studentList;
    const len = studentList.length;
    const classID = req.body.classID;

    let add_flag = await canAdd(studentList, classID);
    console.log(add_flag);

    if(add_flag) {
        let arrIns = [];
        for(let i = 0; i < len; ++i) {
            arrIns[arrIns.length] = {
                maHocSinh: studentList[i],
                maLopHoc: classID
            }
        }
        try {
            let result = await HocSinh_LopHoc.bulkCreate(arrIns);
            for(let i = 0; i < len; ++i) {
                await HocSinh.update({
                    inClass: true
                }, {
                    where: { hocSinh_pkey: studentList[i] }
                });
            }

            LopHoc.update({
                siSo: sequelize.literal('siSo + ' + len)
            }, { 
                where: { maLop_pkey: classID }
            });

            subjectCtrl.addAllSubjectInClass(classID, studentList);
            
        } catch(ex) {
            console.log(ex);
            return res.status(500).json({
                success: false,
                message: "Failed to insert student(s) into class"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Insert student in class successfully"
        });
    } else {
        return res.status(200).json({
            success: false,
            message: "Some students exist in another class, or not enough level for this class"
        });
    }
}

function delStuInClass(req, res) {
    let studentList = req.body.studentList || req.body.studentList || [];
    let classID = req.body.classID || req.body.classID;
    delStudents(res, studentList, 0, classID);
}

function delStudents(res, studentList, index, classID) {
    if(index > studentList.length - 1)
        return res.status(200).json({
            success: true,
            message: "Delete student in class successfully"
        });
    else {
        HocSinh_LopHoc.findOne({ where: {
            maHocSinh: studentList[index],
            maLopHoc: classID
        }})
        .then((result) => {
            if(result) {
                DiemMH.destroy({
                    where: {
                        maHocSinh: result.maHocSinh,
                        maLopHoc: result.maLopHoc
                    }
                })
                .then((result) => {
                    return HocSinh_LopHoc.destroy({ 
                        where: {
                            maHocSinh: studentList[index],
                            maLopHoc: classID
                        }
                    })
                })
                .then((rows) => {
                    if(rows > 0) {
                        HocSinh.update({
                            inClass: false
                        }, {
                            where: { hocSinh_pkey: result.maHocSinh }
                        });

                        LopHoc.update({
                            siSo: sequelize.literal('siSo - 1')
                        }, { 
                            where: { maLop_pkey: result.maLopHoc }
                        });
                    }
                    delStudents(res, studentList, index + 1, classID);
                });
            } else {
                delStudents(res, studentList, index + 1, classID);
            }
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                message: "Failed to delete student into class"
            });
        });
    }
}

function getStuInClass(req, res) {
    HocSinh_LopHoc.findAll({
        where: {
            maLopHoc: req.query.classID
        },
        include: [{
            model: HocSinh,
            where: {
                hocSinh_pkey: Sequelize.col('HOCSINH_LOPHOC.MA_HOC_SINH'),
                delete_flag: '0'
            }
        }]
    })
    .then((result) => {
        let objReturning = [];
        const len = result.length;
        for(let i = 0; i < len; ++i) {
            objReturning[objReturning.length] = {
                studentID: result[i]['AE_HOC_SINH'].hocSinh_pkey,
                studentCode: result[i]['AE_HOC_SINH'].maHocSinh,
                name: result[i]['AE_HOC_SINH'].hoTen,
                birthday: changeToDDMMYYYY(result[i]['AE_HOC_SINH'].ngaySinh),
                gender: result[i]['AE_HOC_SINH'].gioiTinh,
                average1: result[i].tongHK1 || '',
                average2: result[i].tongHK2 || '',
                average: result[i].tongCaNam || '',
                address: result[i]['AE_HOC_SINH'].diaChi,
                email: result[i]['AE_HOC_SINH'].email,

                schoolYearID: result[i]['AE_HOC_SINH'].namNhapHoc,
                inClass: result[i]['AE_HOC_SINH'].inClass
            }
        }

        return res.status(200).json({
            success: true,
            message: "Get student(s) in class successfully",
            datas: objReturning
        });
        // } else {
        //     return res.status(200).json({
        //         success: false,
        //         message: "No student found"
        //     });
        // }
    })
    .catch((err) => {
        return res.status(500).json({
            success: false,
            message: "Failed to get student(s) in class"
        });
    });
}

export default { addStuInClass, delStuInClass, getStuInClass };