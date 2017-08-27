import { sequelize, Sequelize } from './index-model';
import Invoice from './Invoice-model';
import Item from './item-model';


const InvoiceDetail = sequelize.define('INVOICE_DETAIL', {
    ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        notNull: true,
        field: 'ID'
    },
    invoiceID: {
        type: Sequelize.INTEGER,
        notNull: true,
        field: 'INVOICE_ID'
    },
    itemID: {
        type: Sequelize.INTEGER,
        notNull: true,
        field: 'ITEM_ID'
    },
    quantity: {
        type: Sequelize.INTEGER,
        notNull: false,
        field: 'QUANTITY'
    },
    price: {
        type: Sequelize.DECIMAL,
        notNull: false,
        field: 'PRICE'
    }
});

Invoice.hasMany(InvoiceDetail, { foreignKey: 'invoiceID', sourceKey: 'ID' });
InvoiceDetail.belongsTo(Invoice, { foreignKey: 'invoiceID', targetKey: 'ID' });

Item.hasMany(InvoiceDetail, { foreignKey: 'itemID', sourceKey: 'ID' });
InvoiceDetail.belongsTo(Item, { foreignKey: 'itemID', targetKey: 'ID' });

export default InvoiceDetail;