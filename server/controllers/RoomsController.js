const {Rooms} = require('../models');

class RoomsController {
    async getAllRooms(req, res) {
        try {
            const rooms = await Rooms.findAll({
                attributes: ['id', 'RoomName']
            });
            return res.status(200).json({rooms});
        } catch (error) {
            return res.status(500).json({error: 'Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!'});
        }
    };
}


module.exports = new RoomsController();