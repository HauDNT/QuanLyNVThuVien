const {
    Users,
    UsersInfo,
    User_Roles,
    Roles,
    Sequelize,
} = require('../models');

class RolesController {
    async getAllRoles(req, res) {
        try {
            const allRoles = await Roles.findAll({
                attributes: ['id', 'RoleName', 'Description']
            });
            return res.json(allRoles);
        } catch (error) {
            return res.sjon({error: 'Đã xảy ra lỗi trong quá trình tải lên dữ liệu!'});
        }
    };

    // Xuất/Tìm kiếm quyền và chức năng theo UserId:
    async getRole_PermissByUserId(req, res) {
        const userId = req.params.userId;

        try {
            const data = await Users.findAll({
                include: [
                    {
                        model: User_Roles,
                        include: [
                            {
                                model: Roles,
                                attributes: ['RoleName', 'Description'],
                            }
                        ],
                        attributes: ['RoleId'],
                    },
                    {
                        model: UsersInfo,
                        attributes: ['Fullname'],
                    }
                ],
                attributes: ['username'],
                where: {id: userId}
            });

            if (!data)  
                return res.json({error: 'Không có dữ liệu phân quyền về người dùng này!'});

            // Nếu có dữ liệu thì format lại cùng cấp trước khi trả về Client:
            const formatData = data.map(item => ({
                username: item.username,
                fullname: item.UsersInfo.Fullname,
                RoleId: item.User_Role.RoleId,
                RoleName: item.User_Role.Role.RoleName,
                Description: item.User_Role.Role.Description,
            }));

            res.json(formatData);
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi trong quá trình tải lên dữ liệu!'});
        }
    }
};

module.exports = new RolesController();