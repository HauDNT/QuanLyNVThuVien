const { Positions, UsersInfo } = require("../models");

class PositionsController {
  async getAllPositions(req, res) {
    try {
      const positions = await Positions.findAll({
        attributes: ["id", "PositionName", "Description"],
      });
      return res.status(200).json(positions);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!" });
    }
  }

  async createPosition(req, res) {
    try {
      const { positionName, description } = req.body;
      await Positions.create({
        PositionName: positionName,
        Description: description,
      });

      return res.json({ success: "Tạo chức vụ mới thành công!" });
    } catch (error) {
      return res.json({ error: "Đã xảy ra lỗi khi tạo chức vụ mới!" });
    }
  }

  async deletePosition(req, res) {
    const positionId = req.params.id;
    try {
      // Trước khi xóa thì chuyển chức vụ của các tài khoản có chức vụ này sang "Không xác định"
      await UsersInfo.update(
        { PositionId: 1 },
        { where: { PositionId: positionId } },
      );

      // Sau đó mới xóa chức vụ:
      await Positions.destroy({
        where: {
          id: positionId,
        },
        force: true,
      });

      return res.json({
        success:
          'Xóa chức vụ thành công! Các tài khoản thuộc chức vụ này sẽ được chuyển thành "Không xác định"',
      });
    } catch (error) {
      return res.json({
        error: "Đã xảy ra lỗi khi xóa chức vụ. Vui lòng thử lại sau.",
      });
    }
  }
}

module.exports = new PositionsController();
