import { sequelize, Sequelize } from '../models/index';
import NamHoc from '../models/namhoc-model';
import QuyDinh from '../models/quydinh-model';
import regulationCtrl from './regulation-controller';
import subjectCtrl from './subject-controller';
import classCtrl from './class-controller';
import studentCtrl from './student-controller';
import { loadCommonObj } from '../middlewares/common';
import commonObj from '../utilities/common_object';


function getSchoolYear(req, res) {
    NamHoc.findAll().then((result) => {
        const len = result.length;
        if(len > 0) {
            let objReturning = [];
            for(let i = 0; i < len; ++i) {
                objReturning[objReturning.length] = {
                    schoolYearID: result[i].namHoc_pkey,
                    schooYearCode: result[i].maNamHoc,
                    schoolYearName: result[i].tenNamHoc,
                    status: result[i].startFlag
                }
            }

            return res.status(200).json({
                success: true,
                message: "Get school year(s) successfully",
                data: objReturning
            });
        } else {
            return res.status(200).json({
                success: false,
                message: "No school year(s) found"
            });
        }
    })
    .catch((err) => {
        return res.status(500).json({
            success: false,
            message: "Failed to school year(s)"
        });
    });
}

function getFutureSchoolYear(req, res) {
    NamHoc.findAll({ 
        where: { startFlag: '0' }
    }).then((result) => {
        const len = result.length;

        let objReturning = [];
        for(let i = 0; i < len; ++i) {
            objReturning[objReturning.length] = {
                schoolYearID: result[i].namHoc_pkey,
                schooYearCode: result[i].maNamHoc,
                schoolYearName: result[i].tenNamHoc,
                status: result[i].startFlag
            }
        }

        return res.status(200).json({
            success: true,
            message: "Get future school year(s) successfully",
            datas: objReturning
        });
    })
    .catch((err) => {
        return res.status(500).json({
            success: false,
            message: "Failed to school year(s)"
        });
    });
}

function addNewSchoolYear(req, res) {
    NamHoc.create({
        maNamHoc: req.body.year,
        tenNamHoc: req.body.year
    }).then((result) => {
        let objReturning = {
            schoolYearID: result.namHoc_pkey,
            schoolYearCode: result.maNamHoc,
            schoolYearName: result.tenNamHoc,
            startFlag: result.startFlag
        };

        regulationCtrl.insertRegulation(req, res, result.namHoc_pkey)
        .then(() => {
            return res.status(200).json({
                success: true,
                message: "Create new school year successfully",
                data: objReturning
            });
        });
    }).catch((err) => {
        return res.status(500).json({
            success: false,
            message: "Failed to create school year"
        });
    });
}

function changeSchoolYear(req, res) {
    const schoolYearID = req.body.schoolYearID || req.query.schoolYearID;
    if(schoolYearID) {
        QuyDinh.findOne({ where: { maNamHoc: schoolYearID } })
        .then((result) => {
            if(result) {
                let currentYear = commonObj.schoolYearID;
                NamHoc.update({ startFlag: '2' }, { where: { startFlag: '1' }})
                .then((result) => {
                    return NamHoc.update({ startFlag: '1' }, { where: { namHoc_pkey: schoolYearID, startFlag: '0' }})
                })
                .then((result) => {
                    console.log(result);
                    if(result[0] === 0) {
                        updateStatus(currentYear, schoolYearID);
                        return res.status(200).json({
                            success: false,
                            message: "Cannot change school year, because school year want to change in the past"
                        });
                    } else {
                        
                        try {
                            classCtrl.addClass(schoolYearID);
                            subjectCtrl.addSubjects(schoolYearID);
                            studentCtrl.updateForNewSchoolYear();
                            loadCommonObj();

                            return res.status(200).json({
                                success: true,
                                message: "Change the current school year successfully"
                            });
                        } catch(ex) {
                            console.log(ex);
                            return res.status(500).json({
                                success: false,
                                message: "Failed to the current school year"
                            });
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                    updateStatus(currentYear, schoolYearID);
                    return res.status(500).json({
                        success: false,
                        message: "Failed to the current school year"
                    });
                });
            } else {
                return res.status(200).json({
                    success: false,
                    message: "Cannot change school year, because regulation has not found"
                })
            }
        })
    } else {
        return res.status(200).json({
            success: false,
            message: "No school year ID in request"
        });
    }
}

function updateStatus(current, newYear) {
    NamHoc.update({ startFlag: '0' }, { where: { namHoc_pkey: newYear, startFlag: '0' }});
    NamHoc.update({ startFlag: '1' }, { where: { namHoc_pkey: current }});
}

export default { getSchoolYear, getFutureSchoolYear, addNewSchoolYear, changeSchoolYear }