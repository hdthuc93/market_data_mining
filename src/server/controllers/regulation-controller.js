import QuyDinh from '../models/quydinh-model';
import NamHoc from '../models/namhoc-model';
import { generateRegulationID } from '../utilities/id_generates';
import commonObj from '../utilities/common_object';

function insertRegulation(req, res, schoolYearID) {
    const insertObj = {
        tuoiMin: commonObj.ageMin,
        tuoiMax: commonObj.ageMax,
        diemChuan: commonObj.minScore,
        dsKhoi10: commonObj.listGrade10,
        dsKhoi11: commonObj.listGrade11,
        dsKhoi12: commonObj.listGrade12,
        dsMonHoc: commonObj.listSubjects,
        maNamHoc: schoolYearID
    };

    return generateRegulationID(schoolYearID)
    .then((regulationID) => {
        insertObj.maQuyDinh = regulationID;

        if(regulationID) {
            QuyDinh.create(insertObj)
            .then();
        }
    })
    .catch((err) => {
        console.log(err);
        throw new Error(err);
    })
}

function updateRegulation(req, res) {
    const updateObj = {
        tuoiMin: req.body.minAge || req.query.minAge,
        tuoiMax: req.body.maxAge || req.query.maxAge,
        diemChuan: req.body.minScore || req.query.minScore,
        dsKhoi10: JSON.stringify({ grade10: req.body.grade10 || req.query.grade10 }),
        dsKhoi11: JSON.stringify({ grade11: req.body.grade11 || req.query.grade11 }),
        dsKhoi12: JSON.stringify({ grade12: req.body.grade12 || req.query.grade12 }),
        dsMonHoc: JSON.stringify({ course: req.body.course || req.query.course }),
    };

    const schoolYearID = req.body.schoolYearID || req.query.schoolYearID

    NamHoc.findOne({ where: { namHoc_pkey: schoolYearID } })
    .then((result) => {
        if(!result) {
            return res.status(200).json({
                success: false,
                message: "No school year ID has been found"
            });
        } else if(result.startFlag === '0') {
            QuyDinh.update(updateObj, { where: { maNamHoc: schoolYearID } })
            .then((result) => {
                if(result.length === 1) {
                    return res.status(200).json({
                        success: true,
                        message: "Update new regulation successfully"
                    });
                } else {
                    return res.status(200).json({
                        success: false,
                        message: "No record regulation is updated"
                    });
                }
            })
        } else {
            return res.status(200).json({
                success: false,
                message: "Cannot update regulation, because the school year has been or is going on"
            });
        }
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to update new regulation"
        });
    });
}

function getRegulation(req, res) {
    QuyDinh.findOne({
        where: { maNamHoc: req.query.schoolYearID || commonObj.schoolYearID },
        include: [{
            model: NamHoc
        }]
    })
    .then((result) => {
        let objReturning = {};
        if(result) {
            objReturning = {
                regulationID: result.quyDinh_pkey,
                regulationCode: result.maQuyDinh,
                minAge: result.tuoiMin,
                maxAge: result.tuoiMax,
                minScore: result.diemChuan,
                schoolYearID: result.maNamHoc,
                schoolYearName: result['M_NAM_HOC'].tenNamHoc
            };
            objReturning = Object.assign({}, objReturning, JSON.parse(result.dsKhoi10));
            objReturning = Object.assign({}, objReturning, JSON.parse(result.dsKhoi11));
            objReturning = Object.assign({}, objReturning, JSON.parse(result.dsKhoi12));
            objReturning = Object.assign({}, objReturning, JSON.parse(result.dsMonHoc));
        }

        return res.status(200).json({
            success: true,
            message: "Get regulation successfully",
            data: objReturning
        });
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to get regulation"
        });
    });
}

export default { insertRegulation, updateRegulation, getRegulation };
