import Khoi from '../models/khoi-model';

function getGrade(req, res) {
    Khoi.findAll().then((result) => {
        const len = result.length;
        if(len > 0) {
            let objReturning = [];
            for(let i = 0; i < len; ++i) {
                objReturning[objReturning.length] = {
                    gradeID: result[i].maKhoi_pkey,
                    gradeCode: result[i].maKhoi,
                    gradeName: result[i].tenKhoi
                }
            }

            return res.status(200).json({
                success: true,
                message: "Get grade(s) successfully",
                data: objReturning
            });
        } else {
            return res.status(200).json({
                success: false,
                message: "No grade(s) found"
            });
        }
    })
    .catch((err) => {
        return res.status(500).json({
            success: false,
            message: "Failed to grade(s)"
        });
    });
}

export default { getGrade };