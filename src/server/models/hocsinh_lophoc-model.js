import { sequelize, Sequelize } from './index';
import HocSinh from './hocsinh-model';
import LopHoc from './lophoc-model';


const HocSinh_LopHoc = sequelize.define('HOCSINH_LOPHOC', {
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
    tongHK1: {
        type: Sequelize.DECIMAL(4, 2),
        field: 'TONG_HK1'
    },
    tongHK2: {
        type: Sequelize.DECIMAL(4, 2),
        field: 'TONG_HK2'
    },
    tongCaNam: {
        type: Sequelize.DECIMAL(4, 2),
        field: 'TONG_CA_NAM'
    },
    passed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        field: 'PASSED'
    }
});

HocSinh.hasMany(HocSinh_LopHoc, { foreignKey: 'maHocSinh', sourceKey: 'hocSinh_pkey' });
HocSinh_LopHoc.belongsTo(HocSinh, { foreignKey: 'maHocSinh', targetKey: 'hocSinh_pkey' });

LopHoc.hasMany(HocSinh_LopHoc, { foreignKey: 'maLopHoc', sourceKey: 'maLop_pkey' });
HocSinh_LopHoc.belongsTo(LopHoc, { foreignKey: 'maLopHoc', targetKey: 'maLop_pkey' });

export default HocSinh_LopHoc;