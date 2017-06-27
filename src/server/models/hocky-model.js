import { sequelize, Sequelize } from './index';

const HocKy = sequelize.define('M_HOC_KI', {
    hocKy_pkey: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        notNull: true,
        autoIncrement: true,
        field: 'HOC_KY_PKEY'
    },
    maHocKy: {
        type: Sequelize.STRING,
        unique: true,
        notNull: true,
        field: 'MA_HOC_KY'
    },
    tenHocKy: {
        type: Sequelize.STRING,
        notNull: true,
        field: 'TEN_HOC_KY'
    }
});

export default HocKy;