import { sequelize, Sequelize } from './index';

const NamHoc = sequelize.define('M_NAM_HOC', {
    namHoc_pkey: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        notNull: true,
        autoIncrement: true,
        field: 'NAM_HOC_PKEY'
    },
    maNamHoc: {
        type: Sequelize.STRING,
        notNull: true,
        unique: true,
        field: 'MA_NAM_HOC'
    },
    tenNamHoc: {
        type: Sequelize.STRING,
        notNull: true,
        field: 'TEN_NAM_HOC'
    },
    startFlag: {
        type: Sequelize.STRING,
        notNull: true,
        defaultValue: '0',
        field: 'START_FLAG'
    }
});

export default NamHoc;