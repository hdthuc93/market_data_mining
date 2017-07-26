import { sequelize, Sequelize } from './index';
import Cell from './shelf-model';


const Item = sequelize.define('ITEM', {
    ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        notNull: true,
        field: 'ID'
    },
    name: {
        type: Sequelize.STRING,
        notNull: true,
        field: 'NAME'
    },
    size: {
        type: Sequelize.INTEGER,
        notNull: true,
        field: 'SIZE'
    }
});

export default Cell;