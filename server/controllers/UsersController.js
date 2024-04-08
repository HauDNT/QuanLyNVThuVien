const {Users} = require('../models');       
const bcrypt = require('bcrypt');           // Using Bcrypt to hash and check password
const {sign} = require('jsonwebtoken');     // Using Json Web Token

class UsersController {
    async findAllUsers(req, res) {
        try {
            const allUsers = await Users.findAll();
            res.json({allUsers: allUsers});
        } catch (errorMessage) {
            return res.json({error: 'Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!'});
        }
    };

    async register(req, res) {
        try {
            const {username, password} = req.body;
            const hash = await bcrypt.hash(password, 10);

            const hasUserExist = await Users.findOne({where: {Username: username}});
            if (hasUserExist === null) {
                Users.create({
                    Username: username,     // Các trường được gán phải giống như models
                    Password: hash,
                });
    
                return res.json({success: 'Đăng ký thành công. Bạn có thể đăng nhập ngay bây giờ.'})
            }
            else {
                return res.json({error: 'Tên người dùng đã tồn tại. Hãy chọn tên khác.'})
            }
        } catch (errorMessage) {
            return res.json({error: 'Đã xảy ra lỗi từ máy chủ. Hãy thử lại sau.'});
        }
    };

    async login(req, res) {
        try {
            const {username, password} = req.body;
            const getUSer = await Users.findOne({where: {Username: username}});
            if (!getUSer) {
                return res.json({error: 'Tên người dùng không tồn tại. Hãy kiểm tra và thử lại!'});
            }
            
            const match = await bcrypt.compare(password, getUSer.Password);
            if (!match) {
                return res.json({error: 'Mật khẩu không đúng. Hãy kiểm tra và thử lại!'});
            }

            return res.json({
                                success: 'Đăng nhập thành công',
                                username: getUSer.Username,
                                id: getUSer.id,
                            });
        } catch (errorMessage) {
            return res.json({error: 'Đã xảy ra lỗi từ máy chủ. Hãy thử lại sau!'})
        }
    };
}

module.exports = new UsersController();