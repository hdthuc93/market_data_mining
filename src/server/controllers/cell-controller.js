import { sequelize } from "../models/index-model";
import Cell from '../models/cell-model';

function updatePosition(req, res) {
    let reqObj = {
        itemId: '',//req.body || req.query
        areaId: '',
        row_old: '',
        col_old: '',
        row_new: '',
        col_new: ''
    }

    Cell.findAndCountAll({ 
        where: {
            rowIndex: reqObj.row_new,
            colIndex: reqObj.col_new
        } 
    })
    .then((result) => {
        if(result.count > 0) {
            return res.status(200).json({
                success: false,
                message: "Cannot update new position. Because new position had exist"
            });
        }
    })
}

export default { updatePosition };