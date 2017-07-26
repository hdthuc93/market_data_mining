import { sequelize, Sequelize } from './index-model';

const Area = sequelize.define('AREA', {
    ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        notNull: true,
        autoIncrement: true,
        field: 'ID'
    },
    name: {
        type: Sequelize.STRING,
        unique: true,
        notNull: true,
        field: 'NAME'
    },
    rowNum: {
        type: Sequelize.INTEGER,
        notNull: true,
        field: 'NUM_OF_ROWS'
    },
    colNum: {
        type: Sequelize.INTEGER,
        notNull: true,
        field: 'NUM_OF_COLS'
    },
    shelfNum: {
        type: Sequelize.INTEGER,
        notNull: true,
        field: 'NUM_OF_SHELVES'
    },
    xAxis: {
        type: Sequelize.INTEGER,
        notNull: true,
        field: 'X_AXIS'
    },
    yAxis: {
        type: Sequelize.INTEGER,
        notNull: true,
        field: 'Y_AXIS'
    },
    rad: {
        type: Sequelize.INTEGER,
        notNull: true,
        field: 'RADIAN'
    }
});

export default Area;