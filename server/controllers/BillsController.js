const {Bills} = require('../models');

class BillsController {
    async getAllBills(req, res) {
        try {
            const getBills = await Bills.findAll();
            res.json({bills: getBills});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!'});
        }
    };

    async getReceiveBills(req, res) {
        try {
            const receiveBills = await Bills.findOne({where: {NumberBill: 41}});    // Testing success
            res.json({bills: receiveBills});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!'});
        }
    };
}

module.exports = new BillsController();