import jwt from 'jsonwebtoken';
import config from '../configs/connection';
import User from '../models/user-model';


function authenToken(req, res, next) {
    const token = req.header('token') || req.body.token;
    console.log(token);

    if(token) {
        jwt.verify(token, config.secretKey, (err, decoded) => {
            if(err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to authentication"
                });
            }

            User.findOne({ where: { username: decoded.username }}).then((user) => {
                if(user)
                    return next();

                return res.status(200).json({
                    success: false,
                    message: "Invalid token"
                });
            });
        })
    } else {
        return res.status(200).json({
                    success: false,
                    message: "Failed to authentication, token not found"
                });
    }
}

export default { authenToken }