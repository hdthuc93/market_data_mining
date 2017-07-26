import { sequelize, Sequelize } from './index-model';

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
    price: {
        type: Sequelize.DECIMAL,
        notNull: true,
        field: 'PRICE'
    },
    size: {
        type: Sequelize.INTEGER,
        notNull: true,
        field: 'SIZE'
    },
    createdDate: {
        type: Sequelize.DATE,
        notNull: true,
        field: "CREATED_DATE"
    },
    expiredDate: {
        type: Sequelize.DATE,
        notNull: true,
        field: "EXPIRED_DATE"
    }
});

export default Item;