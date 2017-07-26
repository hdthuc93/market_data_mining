import { sequelize, Sequelize } from './index-model';
import Area from './area-model';
import Item from './item-model';


const Cell = sequelize.define('CELL', {
    ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        notNull: true,
        field: 'ID'
    },
    rowIndex: {
        type: Sequelize.INTEGER,
        field: 'ROW_INDEX'
    },
    colIndex: {
        type: Sequelize.INTEGER,
        field: 'COL_INDEX'
    },
    areaID: {
        type: Sequelize.INTEGER,
        notNull: false,
        field: 'AREA_ID'
    },
    itemID: {
        type: Sequelize.INTEGER,
        notNull: false,
        field: 'ITEM_ID'
    },
    isEmpty: {
        type: Sequelize.BOOLEAN,
        notNull: false,
        field: 'IS_EMPTY'
    }
});

Area.hasMany(Cell, { foreignKey: 'areaID', sourceKey: 'ID' });
Cell.belongsTo(Area, { foreignKey: 'areaID', targetKey: 'ID' });

Item.hasMany(Cell, { foreignKey: 'itemID', sourceKey: 'ID' });
Cell.belongsTo(Item, { foreignKey: 'itemID', targetKey: 'ID' });

export default Cell;