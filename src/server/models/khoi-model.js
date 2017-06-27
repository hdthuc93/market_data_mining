import { sequelize, Sequelize } from './index';


const Khoi = sequelize.define('M_KHOI', {
    maKhoi_pkey: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        notNull: true,
        field: 'MA_KHOI_PKEY'
    },
    maKhoi: {
        type: Sequelize.STRING,
        notNull: true,
        unique: true,
         field: 'MA_KHOI'
    },
    tenKhoi: {
        type: Sequelize.STRING,
        notNull: true,
        field: 'TEN_KHOI'
    }
});

export default Khoi;