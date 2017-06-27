import { sequelize, Sequelize } from './index';
import HocSinh_LopHoc from './hocsinh_lophoc-model';
import MonHoc from './monhoc-model';
import HocKy from './hocky-model';

const DiemMH = sequelize.define('AE_DIEM_MON_HOC', {
    maHocSinh: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        notNull: true,
        field: 'MA_HOC_SINH'
    },
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
    diem_15phut: {
        type: Sequelize.DECIMAL(4, 2),
        field: 'DIEM_15_PHUT'
    },
    diem_1tiet: {
        type: Sequelize.DECIMAL(4, 2),
        field: 'DIEM_1_TIET'
    },
    diemCuoiKy: {
        type: Sequelize.DECIMAL(4, 2),
        field: 'DIEM_CUOI_KI'
    },
    tongDiem: {
        type: Sequelize.DECIMAL(4, 2),
        field: 'TONG_DIEM'
    }
});

HocSinh_LopHoc.hasMany(DiemMH, { foreignKey: 'maHocSinh', sourceKey: 'maHocSinh' });
DiemMH.belongsTo(HocSinh_LopHoc, { foreignKey: 'maHocSinh', targetKey: 'maHocSinh' });

HocSinh_LopHoc.hasMany(DiemMH, { foreignKey: 'maLopHoc', sourceKey: 'maLopHoc' });
DiemMH.belongsTo(HocSinh_LopHoc, { foreignKey: 'maLopHoc', targetKey: 'maLopHoc' });

MonHoc.hasMany(DiemMH, { foreignKey: 'maMonHoc', sourceKey: 'monHoc_pkey' });
DiemMH.belongsTo(MonHoc, { foreignKey: 'maMonHoc', targetKey: 'monHoc_pkey' });

HocKy.hasMany(DiemMH, { foreignKey: 'maHocKy', sourceKey: 'hocKy_pkey' });
DiemMH.belongsTo(HocKy, { foreignKey: 'maHocKy', targetKey: 'hocKy_pkey' });

export default DiemMH;