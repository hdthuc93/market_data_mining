import Sequelize from 'sequelize';
import config from '../configs/connection';

const sequelize = new Sequelize(config.nameDB, config.userDB, config.passwordDB, {
    host: config.hostDB,
    dialect: 'mysql',
    port: config.portDB,
    define: {
        freezeTableName: true,
        timestamps: false
    }
});

export { sequelize, Sequelize };