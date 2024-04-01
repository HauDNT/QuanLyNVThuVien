const {verify} = require('jsonwebtoken');

const validToken = (req, res, next) => {
    const accessTokenUser = req.header('accessToken');

    if (!accessTokenUser)
        return res.json({error: 'User not login!'});
    try {
        const validToken = verify(accessTokenUser, 'secretkey');
        {res.user = validToken};

        if (validToken) {
            return next();
        }
    } catch (errorMessage) {
        return res.json({error: errorMessage});
    }
} ;

module.exports = {validToken};