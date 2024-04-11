const {verify} = require('jsonwebtoken');

const validToken = (req, res, next) => {
    const accessTokenUser = req.header('authenToken');

    if (!accessTokenUser)
        return res.json({error: 'Bạn chưa đăng nhập.'});
    
    try {
        const validToken = verify(accessTokenUser, 'AuthenticateToken');

        if (validToken) {
            res.user = validToken;
            return next();
        }
        else {
            return res.json({error: 'Thông tin đăng nhập không hợp lệ - Authen Middleware'})
        }
    } catch (errorMessage) {
        return res.json({error: 'Đã xảy ra lỗi xác thực'});
    }
} ;

module.exports = {validToken};