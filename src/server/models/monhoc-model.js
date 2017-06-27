import { sequelize, Sequelize } from './index';
import NamHoc from './namhoc-model';

const MonHoc = sequelize.define('M_MON_HOC', {
    monHoc_pkey: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        notNull: true,
        autoIncrement: true,
        field: 'MON_HOC_PKEY'
    },
    tenMonHoc: {
        type: Sequelize.STRING,
        notNull: true,
        field: 'TEN_MON_HOC'
    },
    maNamHoc: {
        type: Sequelize.INTEGER,
        notNull: true,
        field: 'MA_NAM_HOC'
    }
});

NamHoc.hasMany(MonHoc, { foreignKey: 'maNamHoc', sourceKey: 'namHoc_pkey' });
MonHoc.belongsTo(NamHoc, { foreignKey: 'maNamHoc', targetKey: 'namHoc_pkey' });

export default MonHoc;