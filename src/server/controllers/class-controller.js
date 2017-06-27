import LopHoc from '../models/lophoc-model';
import QuyDinh from '../models/quydinh-model';
import commonObj from '../utilities/common_object';

function getClass(req, res) {
    LopHoc.findAll({
        where: {
            maNamHoc: commonObj.schoolYearID,
            maKhoi: req.query.gradeID
        }
    })
    .then((result) => {
        let objReturning = [];
        const len = result.length;
        if(len > 0) {
            for(let i = 0; i < len; ++i) {
                objReturning[objReturning.length] = {
                    classID: result[i].maLop_pkey,
                    classCode: result[i].maLopHoc,
                    className: result[i].tenLop,
                    numOfStus: result[i].siSo,
                    maxNum: result[i].siSoMax,
                    gradeID: result[i].maKhoi,
                    schoolYearID: result[i].maNamHoc,
                }
            }

            return res.status(200).json({
                success: true,
                message: "Get class(s) successfully",
                datas: objReturning
            });
        } else {
            return res.status(200).json({
                success: false,
                message: "No class found"
            });
        }
    })
    .catch((err) => {
        return res.status(500).json({
            success: false,
            message: "Failed to get class(s)"
        });
    });
}

async function addClass(schoolYearID) {
    try {
        let result = await QuyDinh.findOne({
            where: { maNamHoc: schoolYearID }
        })

        for(let i = 0; i < 3; ++i) {
            let arrClasses = JSON.parse(result['dsKhoi1' + i]);
            arrClasses = arrClasses['grade1' + i]
            let arrIns = []
            for(let j = 0; j < arrClasses.length; ++j) {
                arrIns[arrIns.length] = {
                    maLopHoc: arrClasses[j].className + '_' + schoolYearID,
                    tenLop: arrClasses[j].className,
                    siSoMax: arrClasses[j].maxQty,
                    maKhoi: i + 1,
                    maNamHoc: schoolYearID
                }
            };

            LopHoc.bulkCreate(arrIns);
        }
    } catch(ex) {
        console.log("--------------", ex);
        throw new Error(ex);
    }
}

export default { getClass, addClass };