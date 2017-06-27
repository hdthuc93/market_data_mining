import bcrypt from 'bcrypt';
import { sequelize, Sequelize } from './index';

const User = sequelize.define('M_USER', {
    user_pkey: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'USER_PKEY'
    },
    username: {
        type: Sequelize.STRING,
        notNull: true,
        field: 'USER_NAME'
    },
    password: {
        type: Sequelize.STRING,
        notNull: true,
        field: 'PASSWORD'
    },
    fullName: {
        type: Sequelize.STRING,
        field: 'FULL_NAME'
    },
});

User.beforeCreate((user, options, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            if(err) 
                return callback(err, options);

            user.password = hash;
            callback(null, options);
        })
    })
});

export default User;
