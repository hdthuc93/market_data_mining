import { sequelize, Sequelize } from './index';
import NamHoc from './namhoc-model';

const QuyDinh = sequelize.define('M_QUY_DINH', {
    quyDinh_pkey: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        notNull: true,
        autoIncrement: true,
        field: 'QUY_DINH_PKEY'
    },
    maQuyDinh: {
        type: Sequelize.STRING,
        notNull: true,
        unique: true,
        field: 'MA_QUY_DINH'
    },
    tuoiMin: {
        type: Sequelize.INTEGER,
        notNull: true,
        field: 'TUOI_MIN'
    },
    tuoiMax: {
        type: Sequelize.INTEGER,
        notNull: true,
        field: 'TUOI_MAX'
    },
    diemChuan: {
        type: Sequelize.DECIMAL(4, 2),
        notNull: true,
        field: 'DIEM_CHUAN'
    },
    dsKhoi10: {
        type: Sequelize.TEXT,
        notNull: true,
        field: 'DS_KHOI10'
    },
    dsKhoi11: {
        type: Sequelize.TEXT,
        notNull: true,
        field: 'DS_KHOI11'
    },
    dsKhoi12: {
        type: Sequelize.TEXT,
        notNull: true,
        field: 'DS_KHOI12'
    },
    dsMonHoc: {
        type: Sequelize.TEXT,
        notNull: true,
        field: 'DS_MON'
    },
    maNamHoc: {
        type: Sequelize.INTEGER,
        notNull: true,
        field: 'MA_NAM_HOC'
    }
});

QuyDinh.belongsTo(NamHoc, { foreignKey: 'maNamHoc', targetKey: 'namHoc_pkey' });

export default QuyDinh;