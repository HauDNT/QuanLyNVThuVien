const {Rooms} = require('../models');

class RoomsController {
    async getAllRooms(req, res) {
        try {
            const rooms = await Rooms.findAll({
                attributes: ['id', 'RoomName']
            });
            return res.json({rooms});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!'});
        }
    };
}


module.exports = new RoomsController();