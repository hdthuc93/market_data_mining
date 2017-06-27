import User from '../models/user-model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../configs/connection';

function register(req, res) {
    User.findOne({ where: { username: req.body.username }}).then((user) => {
        if(user) {
            return res.status(200).json({
                success: false,
                message: "Username alread exists",
                exist_usr: true
            });
        }

        User.create({
            username: req.body.username,
            password: req.body.password,
            fullName: req.body.fullName
        }).then((user) => {
            return res.status(200).json({
                success: true,
                message: "Create user successfully"
            });
        }).catch((err) => {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Failed to create user"
            });
        });
    })
}

function login(req, res) {
    User.findOne({ where: { username: req.body.username }}).then((user) => {
        if(!user) {
            return res.status(200).json({
                success: false,
                message: "Username or password incorrect"
            });
        }

        bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
            if(err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to authenticate user"
                });
            } 

            if(isMatch) {
                jwt.sign({ username: user.username }, config.secretKey, 
                        { algorithm: 'HS256', expiresIn: 60 * 60 * 24 * 7 }, (err, token) => {
                    if(err) {
                        return res.status(500).json({
                            success: false,
                            message: "Error, cannot response a token"
                        });
                    }

                    return res.status(200).json({
                        success: true,
                        message: "Login successfully",
                        name: user.fullName,
                        token: token
                    });
                })
            } else {
                return res.status(200).json({
                    success: false,
                    message: "Username or password incorrect"
                });
            }

        })
    });
}

export default { register, login };
