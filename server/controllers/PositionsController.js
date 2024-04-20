const {Positions} = require('../models');

class PositionsController {
    async getAllPositions(req, res) {
        try {
            const positions = await Positions.findAll({
                attributes: ['id', 'PositionName']
            });
            return res.status(200).json({positions});
        } catch (error) {
            return res.status(500).json({error: 'Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!'});
        }
    }
}

module.exports = new PositionsController();