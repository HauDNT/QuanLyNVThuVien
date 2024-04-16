const {Users, UsersInfo} = require('../models')

class CreateNewPasswordController {
    generateVerifyCode() {
        let codeGenerated = '';

        for (let i = 1; i <= 6; i++) {
            codeGenerated += Math.floor(Math.random() * 10);
        }
    };

    async verifyEmail(req, res) {
        try {
            if (!req.body || !req.body.email) {
                res.json({verifyEmail: 'Không nhận được email!'});
            }
            else {
                const email = req.body.email;
                const findEmail = await Users.findOne(
                    {
                        include: {
                            model: UsersInfo,
                            where: {
                                Email: email
                            }
                        },
                    }
                )
    
                if (!findEmail) res.json({verifyEmail: false});
                else res.json({verifyEmail: true});
            }
        }
        catch {
            return res.json({error: 'Email không chính xác!'});
        }
    }
}

module.exports = new CreateNewPasswordController();