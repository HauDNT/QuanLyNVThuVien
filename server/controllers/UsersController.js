const {
  Users,
  UsersInfo,
  Rooms,
  Positions,
  User_Roles,
  Roles,
  Sequelize,
} = require("../models");
const bcrypt = require("bcrypt"); // Using Bcrypt to hash and check password
const { sign } = require("jsonwebtoken"); // Using Json Web Token
const { Op } = require("sequelize");

class UsersController {
  // Lấy tất cả tài khoản người dùng (username, password):
  async getAllUsers(req, res) {
    try {
      const data = await UsersInfo.findAll({
        include: [
          {
            model: Users,
            where: { id: Sequelize.col("UserId") },
            attributes: ["Username"],
            include: [
              {
                model: User_Roles,
                attributes: ["RoleId"],
                include: [
                  {
                    model: Roles,
                    required: true,
                    attributes: ["RoleName"],
                  },
                ],
              },
            ],
          },
          {
            model: Rooms,
            required: true,
            attributes: ["RoomName"],
          },
          {
            model: Positions,
            required: true,
            attributes: ["PositionName"],
          },
        ],
        attributes: ["UserId", "Fullname", "Email", "PhoneNumber", "Avatar"],
      });

      const allUsers = data.map((item) => ({
        id: item.UserId,
        Fullname: item.Fullname,
        Email: item.Email,
        PhoneNumber: item.PhoneNumber,
        Avatar: item.Avatar,
        Username: item.User.Username,
        RoleName: item.User.User_Role.Role.RoleName,
        RoomName: item.Room.RoomName,
        PositionName: item.Position.PositionName,
      }));

      res.json(allUsers);
    } catch (errorMessage) {
      return res.json({
        error: "Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!",
      });
    }
  }

  // Lấy tất cả tài khoản hiện có:
  async getAmount(req, res) {
    const amount = await Users.count();
    return res.json(amount);
  }

  // Tìm thông tin 1 người dùng (tài khoản & thông tin cá nhân):
  async getInfoAUser(req, res) {
    const id = req.params.id;

    try {
      const data = await Users.findOne({
        where: { id: +id },
        include: [
          {
            model: UsersInfo,
            where: { UserId: +id },
            attributes: [
              "Fullname",
              "Birthday",
              "Email",
              "PhoneNumber",
              "Avatar",
              "PositionId",
              "RoomId",
            ],
          },
          {
            model: User_Roles,
            where: { UserId: +id },
            attributes: ["RoleId"],
          },
        ],
        attributes: ["id", "Username"],
      });

      if (!data) {
        return res.json({ error: "Không tìm thấy thông tin người dùng" });
      }

      // Format lại dữ liệu về cùng cấp:
      const userInfo = {
        id: data.id,
        Username: data.Username,
        Fullname: data.UsersInfo.Fullname,
        Birthday: data.UsersInfo.Birthday,
        Email: data.UsersInfo.Email,
        PhoneNumber: data.UsersInfo.PhoneNumber,
        Avatar: data.UsersInfo.Avatar,
        RoomId: data.UsersInfo.RoomId,
        PositionId: data.UsersInfo.PositionId,
        RoleId: data.User_Role.RoleId,
      };

      return res.json(userInfo);
    } catch (error) {
      return res.json({
        error: "Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!",
      });
    }
  }

  // Lấy họ tên người dùng:
  async getFullname(req, res) {
    const id = req.params.id;

    try {
      const data = await UsersInfo.findOne({
        attributes: ["Fullname"],
        where: { UserId: +id },
      });

      if (!data) {
        return res.json({
          error: "Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!",
        });
      }

      const fullname = data.Fullname;

      return res.json(fullname);
    } catch (error) {
      return res.json({
        error: "Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!",
      });
    }
  }

  // Đăng nhập:
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const getUser = await Users.findOne({ where: { Username: username } });

      if (!getUser) {
        return res.json({
          error: "Tên người dùng không tồn tại. Hãy kiểm tra và thử lại!",
        });
      }

      const match = await bcrypt.compare(password, getUser.Password);
      if (!match) {
        return res.json({
          error: "Mật khẩu không đúng. Hãy kiểm tra và thử lại!",
        });
      }

      const authenToken = sign(
        { username: getUser.Username, id: getUser.id },
        "AuthenticateToken",
      );
      
      return res.json({
        success: "Đăng nhập thành công",
        id: getUser.id,
        username: getUser.Username,
        status: true,
        authenToken: authenToken,
      });
    } catch (errorMessage) {
      return res.json({ error: "Đã xảy ra lỗi từ máy chủ. Hãy thử lại sau!" });
    }
  }

  // Tạo tài khoản người dùng:
  async register(req, res) {
    try {
      const { username, password } = req.body;
      const hash = await bcrypt.hash(password, 10);

      const hasUserExist = await Users.findOne({
        where: { Username: username },
      });
      if (hasUserExist === null) {
        Users.create({
          Username: username, // Các trường được gán phải giống như models
          Password: hash,
        });

        return res.json({
          success: "Đăng ký thành công. Bạn có thể đăng nhập ngay bây giờ.",
        });
      } else {
        return res.json({
          error: "Tên người dùng đã tồn tại. Hãy chọn tên khác.",
        });
      }
    } catch (errorMessage) {
      return res.json({ error: "Đã xảy ra lỗi từ máy chủ. Hãy thử lại sau." });
    }
  }

  // Tạo thông tin người dùng và loại tài khoản (Được thực hiện sau khi thêm tài khoản thành công):
  async createInfoUser(req, res) {
    try {
      // Lấy id người dùng trước:
      const {
        username,
        fullname,
        email,
        birthday,
        position,
        room,
        avatar,
        role,
        phoneNumber,
      } = req.body;

      const getUserId = await Users.findOne({
        attributes: ["id"],
        where: { Username: username },
      });

      await UsersInfo.create({
        Fullname: fullname,
        Birthday: birthday,
        Email: email,
        Avatar: avatar,
        PositionId: position,
        RoomId: room,
        PhoneNumber: phoneNumber,
        UserId: getUserId.id,
      });

      await User_Roles.create({
        UserId: getUserId.id,
        RoleId: role,
      });

      return res.json({
        success: "Tạo tài khoản mới và thông tin cá nhân thành công!",
      });
    } catch (error) {
      return res.json({ error: "Đã xảy ra lỗi từ máy chủ. Hãy thử lại sau!" });
    }
  }

  // Hàm cập nhật thông tin mới cho người dùng:
  async updateAccount(req, res) {
    const userId = req.params.id;
    const data = req.body;

    try {
      // Nếu có tạo mật khẩu mới thì cập nhật ở model Users:
      if (data && data.NewPassword && data.NewPassword !== "") {
        const hash = await bcrypt.hash(data.NewPassword, 10);
        await Users.update(
          { Password: hash },
          {
            where: { id: userId },
          },
        );
      }

      // Cập nhật loại tài khoản ở model User_Roles:
      if (data && data.RoleId) {
        await User_Roles.update(
          { RoleId: data.RoleId },
          { where: { UserId: userId } },
        );
      }

      // Các trường còn lại thì thuộc UsersInfo nên cập nhật sau cùng:
      const fieldsChange = Object.keys(data);
      const valuesChange = Object.values(data);

      for (let i = 0; i < fieldsChange.length; i++) {
        let attributesUpdating = {};
        if (fieldsChange[i] !== "NewPassword" || fieldsChange[i] !== "RoleId") {
          attributesUpdating[fieldsChange[i]] = valuesChange[i];
          UsersInfo.update(attributesUpdating, { where: { UserId: userId } });
        }
      }

      return res.json({ success: "Đã cập nhật thông tin thành công!" });
    } catch (error) {
      res.json({ error: "Không cập nhật được thông tin!" });
    }
  }

  // Xóa tài khoản (xóa mềm):
  async deleteAccount(req, res) {
    try {
      const accountId = req.params.id;
      await Users.destroy({
        where: {
          id: accountId,
        },
      });
      return res.json({ success: "Xóa tài khoản thành công!" });
    } catch (error) {
      return res.json({
        error: "Đã xảy ra lỗi khi xóa tài khoản. Vui lòng thử lại sau.",
      });
    }
  }

  // Lọc ra tài khoản bị xóa mềm:
  async getAccountSoftDeleted(req, res) {
    try {
      const data = await Users.findAll({
        attributes: ["id", "Username", "Password", "createdAt", "deletedAt"],
        where: {
          deletedAt: {
            [Op.ne]: null,
          },
        },
        paranoid: false,
      });

      const accountDeleted = data.map((item) => ({
        id: item.id,
        Username: item.Username,
        createdAt: item.createdAt,
        deletedAt: item.deletedAt,
      }));

      return res.json(accountDeleted);
    } catch (error) {
      return res.json({
        error: "Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!",
      });
    }
  }

  // Khôi phục tài khoản bị xóa mềm:
  async restoreEachAccount(req, res) {
    const { id } = req.params;
    try {
      await Users.restore({ where: { id: +id } });

      return res.json({ success: "Đã khôi phục thành công!" });
    } catch (error) {
      return res.json({
        error: "Đã xảy ra lỗi trong quá trình khôi phục. Hãy thử lại sau!",
      });
    }
  }

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

      return res.json({ success: "Xóa tài khoản thành công!" });
    } catch (error) {
      return res.json({
        error: "Đã xảy ra lỗi khi xóa tài khoản. Vui lòng thử lại sau.",
      });
    }
  }

  // Hàm tìm kiếm thông tin trên Searchbar:
  async searchUser(req, res) {
    const { selectedCategory, searchValue } = req.body;
    let includeModels = [
      {
        model: Users,
        require: true,
        where: { id: Sequelize.col("UserId") },
        attributes: ["Username"],
      },
      {
        model: Positions,
        require: true,
        where: { id: Sequelize.col("PositionId") },
        attributes: ["PositionName"],
      },
      {
        model: Rooms,
        require: true,
        where: { id: Sequelize.col("RoomId") },
        attributes: ["RoomName"],
      },
    ];

    let whereCondition = {};

    try {
      if (selectedCategory === "Room") {
        let roomId = await Rooms.findOne({
          attributes: ["id"],
          where: { RoomName: searchValue },
        });
        whereCondition.RoomId = roomId.id;
      } else if (selectedCategory === "Position") {
        let positionId = await Positions.findOne({
          attributes: ["id"],
          where: { PositionName: searchValue },
        });
        whereCondition.PositionId = positionId.id;
      } else if (selectedCategory === "Username") {
        let userId = await Users.findOne({
          attributes: ["id"],
          where: { Username: searchValue },
        });
        whereCondition.UserId = userId.id;
      } else {
        whereCondition[selectedCategory] = searchValue;
      }

      const data = await UsersInfo.findAll({
        where: whereCondition,
        include: includeModels,
      });

      const result = data.map((item) => ({
        id: item.id,
        Username: item.User.Username,
        Fullname: item.Fullname,
        Birthday: item.Birthday,
        Email: item.Email,
        PhoneNumber: item.PhoneNumber,
        RoomName: item.Room.RoomName,
        PositionName: item.Position.PositionName,
      }));

      return res.json(result);
    } catch (error) {
      return res.json({ error: "Thông tin tìm kiếm không hợp lệ!" });
    }
  }
}

module.exports = new UsersController();
