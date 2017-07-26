import { sequelize, Sequelize } from './index-model';

const Invoice = sequelize.define('INVOICE', {
    ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        notNull: true,
        autoIncrement: true,
        field: 'ID'
    },
    totalPrice: {
        type: Sequelize.DECIMAL,
        notNull: true,
        field: 'TOTAL_PRICE'
    },
    createdDate: {
        type: Sequelize.DATE,
        notNull: true,
        field: "CREATED_DATE"
    }
});

export default Invoice;