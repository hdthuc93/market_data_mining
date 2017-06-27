import { sequelize, Sequelize } from './index';
import Khoi from './khoi-model';
import NamHoc from './namhoc-model';


const LopHoc = sequelize.define('M_LOP_HOC', {
    maLop_pkey: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        notNull: true,
        autoIncrement: true,
        field: 'MA_LOP_PKEY'
    },
    maLopHoc: {
        type: Sequelize.STRING,
        notNull: true,
        unique: true,
        field: 'MA_LOP_HOC'
    },
    tenLop: {
        type: Sequelize.STRING,
        notNull: true,
        field: 'TEN_LOP'
    },
    siSo: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        field: 'SISO'
    },
    siSoMax: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        field: 'SISO_MAX'
    },
    maKhoi: {
        type: Sequelize.INTEGER,
        field: 'MA_KHOI'
    },
    maNamHoc: {
        type: Sequelize.INTEGER,
        field: 'MA_NAM_HOC'
    }
});

Khoi.hasMany(LopHoc, { foreignKey: 'maKhoi', sourceKey: 'maKhoi_pkey' });
LopHoc.belongsTo(Khoi, { foreignKey: 'maKhoi', targetKey: 'maKhoi_pkey' });

NamHoc.hasMany(LopHoc, { foreignKey: 'maNamHoc', sourceKey: 'namHoc_pkey' });
LopHoc.belongsTo(NamHoc, { foreignKey: 'maNamHoc', targetKey: 'namHoc_pkey' });

export default LopHoc;