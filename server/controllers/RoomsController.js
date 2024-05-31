const { Rooms, UsersInfo, BooksRegisInfo } = require("../models");

class RoomsController {
  async getAllRooms(req, res) {
    try {
      const rooms = await Rooms.findAll({
        attributes: ["id", "RoomName"],
      });
      return res.status(200).json(rooms);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!" });
    }
  }

  async createRoom(req, res) {
    try {
      const { roomName } = req.body;
      await Rooms.create({ RoomName: roomName });

      return res.json({ success: "Tạo phòng mới thành công!" });
    } catch (error) {
      return res.json({ error: "Đã xảy ra lỗi khi tạo phòng mới!" });
    }
  }

  async deleteRoom(req, res) {
    const roomId = req.params.id;
    try {
      // Trước khi xóa thì chuyển phòng của các tài khoản và phân phối sách thuộc phòng này sang "Không xác định"
      await UsersInfo.update({ RoomId: 1 }, { where: { RoomId: roomId } });
      await BooksRegisInfo.update(
        { RoomId: 1, Status: 0 },
        { where: { RoomId: roomId } },
      );

      // Sau đó mới xóa phòng:
      await Rooms.destroy({
        where: {
          id: roomId,
        },
        force: true,
      });

      return res.json({
        success:
          'Xóa phòng thành công! Các tài khoản và phân phối sách thuộc phòng này sẽ được chuyển thành "Không xác định"',
      });
    } catch (error) {
      return res.json({
        error: "Đã xảy ra lỗi khi xóa phòng. Vui lòng thử lại sau.",
      });
    }
  }
}

module.exports = new RoomsController();
