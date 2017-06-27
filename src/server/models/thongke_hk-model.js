import { sequelize, Sequelize } from './index';
import LopHoc from './lophoc-model';
import HocKy from './hocky-model';

const ThongKeHK = sequelize.define('M_THONG_KE_HK', {
    maLopHoc: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        notNull: true,
        field: 'MA_LOP_HOC'
    },
    maHocKy: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        notNull: true,
        field: 'MA_HOC_KI'
    },
    siSo: {
        type: Sequelize.INTEGER,
        field: 'SISO'
    },
    slDat: {
        type: Sequelize.INTEGER,
        field: 'SL_DAT'
    },
    tyLe: {
        type: Sequelize.DECIMAL(4, 2),
        field: 'TY_LE'
    }
});

LopHoc.hasMany(ThongKeHK, { foreignKey: 'maLopHoc', sourceKey: 'maLop_pkey' });
ThongKeHK.belongsTo(LopHoc, { foreignKey: 'maLopHoc', targetKey: 'maLop_pkey' });

HocKy.hasMany(ThongKeHK, { foreignKey: 'maHocKy', sourceKey: 'hocKy_pkey' });
ThongKeHK.belongsTo(HocKy, { foreignKey: 'maHocKy', targetKey: 'hocKy_pkey' });

export default ThongKeHK;