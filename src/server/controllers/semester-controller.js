import HocKy from '../models/hocky-model';

function getSemester(req, res) {
    HocKy.findAll().then((result) => {
        const len = result.length;
        if(len > 0) {
            let objReturning = [];
            for(let i = 0; i < len; ++i) {
                objReturning[objReturning.length] = {
                    semesterID: result[i].hocKy_pkey,
                    semesterCode: result[i].maHocKy,
                    semesterName: result[i].tenHocKy
                }
            }

            return res.status(200).json({
                success: true,
                message: "Get semester(s) successfully",
                data: objReturning
            });
        } else {
            return res.status(200).json({
                success: false,
                message: "No semester(s) found"
            });
        }
    })
    .catch((err) => {
        return res.status(500).json({
            success: false,
            message: "Failed to semester(s)"
        });
    });
}

export default { getSemester };