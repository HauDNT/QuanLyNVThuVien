const {
    Users, 
    UsersInfo,
    Rooms,
    Positions,
    Sequelize,
} = require('../models');       
const bcrypt = require('bcrypt');           // Using Bcrypt to hash and check password
const {sign} = require('jsonwebtoken');     // Using Json Web Token
const { Op, where } = require('sequelize');

class UsersController {
    // Tìm tất cả tài khoản người dùng (username, password):
    async findAllUsers(req, res) {
        try {
            const allUsers = await UsersInfo.findAll({
                include: [
                    {
                        model: Users,
                        required: true,
                        where: {id: Sequelize.col('UserId')},
                        attributes: ['id', 'Username'],
                    },
                    {
                        model: Rooms,
                        required: true,
                        where: {id: Sequelize.col('RoomId')},
                        attributes: ['RoomName'],
                    },
                    {
                        model: Positions,
                        required: true,
                        where: {id: Sequelize.col('PositionId')},
                        attributes: ['PositionName'],
                    }
                ],
                attributes: [
                    'id',
                    'Fullname',
                    'Email',
                    'PhoneNumber',
                    'Avatar',
                ]
            });
            res.json({allUsers: allUsers});
        } catch (errorMessage) {
            return res.json({error: 'Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!'});
        }
    };
    
    // Tìm thông tin người dùng (tài khoản & thông tin cá nhân):
    async findInfoUser(req, res) {
        const id = req.params.id;

        try {
            const userInfo = await Users
                .findOne(
                    {
                        where: {id: +id},
                        include: [{
                            model: UsersInfo, 
                            required: true,
                            where: {UserId: +id},
                        }],
                    }
                );

            if (!userInfo) {
                return res.json({error: 'Không tìm thấy thông tin người dùng'});
            }

            return res.json({userInfo});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!'});
        }
    };

    // Lấy tên người dùng:
    async getFullname(req, res) {
        const id = req.params.id;

        try {
            const fullname = await UsersInfo
                .findOne(
                    {
                        attributes: ['Fullname'],
                        where: {UserId: +id},
                    }
                );

            if (!fullname) {
                return res.json({error: 'Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!'});
            }

            return res.json({userInfo: fullname});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!'});
        }
    }

    // Đăng nhập:
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

    // Tạo tài khoản người dùng:
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

    // Tạo thông tin người dùng (Được thực hiện sau khi thêm tài khoản thành công):
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
                UserId: getUserId ? getUserId.id : 1,
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
    };

    // Khôi phục tài khoản bị xóa mềm:
    async restoreEachAccount(req, res) {
        const {id} = req.params;
        try {
            await Users.restore (
                {where: {id: +id}},
            );
    
            return res.json({success: 'Đã khôi phục thành công!'});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi trong quá trình khôi phục. Hãy thử lại sau!'});
        }
    };

    // Xóa cứng tài khoản (Force delete):
    async forceDeleteAccount(req, res) {
        try {
            const accountId = req.params.id;
    
            await Users.destroy({
                where: {
                    id: accountId,
                },
                force: true,
            });

            return res.json({success: 'Xóa tài khoản thành công!'});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi khi xóa tài khoản. Vui lòng thử lại sau.'})
        }
    };
}

module.exports = new UsersController();