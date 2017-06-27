import { sequelize, Sequelize } from './index';
import LopHoc from './lophoc-model';
import MonHoc from './monhoc-model';
import HocKy from './hocky-model';

const ThongKeMon = sequelize.define('M_THONG_KE_MON', {
    maLopHoc: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        notNull: true,
        field: 'MA_LOP_HOC'
    },
    maMonHoc: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        notNull: true,
        field: 'MA_MON_HOC'
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

LopHoc.hasMany(ThongKeMon, { foreignKey: 'maLopHoc', sourceKey: 'maLop_pkey' });
ThongKeMon.belongsTo(LopHoc, { foreignKey: 'maLopHoc', targetKey: 'maLop_pkey' });

MonHoc.hasMany(ThongKeMon, { foreignKey: 'maMonHoc', sourceKey: 'monHoc_pkey' });
ThongKeMon.belongsTo(MonHoc, { foreignKey: 'maMonHoc', targetKey: 'monHoc_pkey' });

HocKy.hasMany(ThongKeMon, { foreignKey: 'maHocKy', sourceKey: 'hocKy_pkey' });
ThongKeMon.belongsTo(HocKy, { foreignKey: 'maHocKy', targetKey: 'hocKy_pkey' });

export default ThongKeMon;