const {Users, UsersInfo} = require('../models');       
const bcrypt = require('bcrypt');           // Using Bcrypt to hash and check password
const {sign} = require('jsonwebtoken');     // Using Json Web Token
const { Op } = require('sequelize');

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
            const getUser = await Users.findOne({where: {Username: username}});
            if (!getUser) {
                return res.json({error: 'Tên người dùng không tồn tại. Hãy kiểm tra và thử lại!'});
            }
            
            const match = await bcrypt.compare(password, getUser.Password);
            if (!match) {
                return res.json({error: 'Mật khẩu không đúng. Hãy kiểm tra và thử lại!'});
            }

            const authenToken = sign({username: getUser.Username, id: getUser.id}, "AuthenticateToken");
            return res.json({
                                success: 'Đăng nhập thành công',
                                id: getUser.id,
                                username: getUser.Username,
                                status: true,
                                authenToken: authenToken,
                            });
        } catch (errorMessage) {
            return res.json({error: 'Đã xảy ra lỗi từ máy chủ. Hãy thử lại sau!'});
        }
    };

    async createInfoUser(req, res) {
        try {
            // Lấy id người dùng trước:
            const {username, fullname, email, birthday, position, room, avatar} = req.body;
            const getUserId = await Users.findOne({
                attributes: ['id'],
                where: {Username: username}
            });

            await UsersInfo.create({
                Fullname: fullname,
                Birthday: birthday,
                Email: email,
                Avatar: avatar,
                PositionId: position,
                RoomId: room,
                UserId: getUserId.id,
            });

            return res.json({success: 'Tạo tài khoản mới và thông tin cá nhân thành công!'});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi từ máy chủ. Hãy thử lại sau!'});
        }
    };

    // Xóa tài khoản (xóa mềm):
    async deleteAccount(req, res) {
        try {
            const accountId = req.params.id;
            await Users.destroy({
                where: {
                    id: accountId,
                }
            });
            return res.json({success: 'Xóa tài khoản thành công!'});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi khi xóa tài khoản. Vui lòng thử lại sau.'});
        }
    };

    // Lọc ra tài khoản bị xóa mềm:
    async getAccountSoftDeleted(req, res) {
        try {
            const accountDeleted = await Users
                .findAll({
                    attributes: [
                        'id',
                        'Username',
                        'Password',
                        'createdAt',
                        'deletedAt',
                    ],
                    where: {
                        deletedAt: {
                            [Op.ne]: null,
                        }
                    },
                    paranoid: false,
                });
            
            return res.json({accountDeleted});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!'});
        }
    }
}

module.exports = new UsersController();