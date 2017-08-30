import { sequelize } from "../models/index-model";
import Cell from '../models/cell-model';

function updatePosition(item) {
    return Cell.update({
        rowIndex: item.newRow,
        colIndex: item.newCol
    },{ 
        where: {
            ID: item.cellId
        }
    });
}

export default { updatePosition };