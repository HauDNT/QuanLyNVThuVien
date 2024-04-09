const {Bills, BillToType} = require('../models');

class BillsController {
    // Lấy toàn bộ hóa đơn:
    async getAllBills(req, res) {
        try {
            const getBills = await Bills.findAll();
            res.json({bills: getBills});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!'});
        }
    };

    // Lấy hóa đơn mua / tặng:
    async getBillOfType(req, res) {
        const type = req.params.type;

        try {
            const receiveBills = await Bills
                .findAll({
                    include: [
                        {
                            model: BillToType,
                            require: true,
                        }
                    ],
                    where: {
                        '$BillToType.BillTypeId$': type,
                    }
                });

                if (!receiveBills) {
                    return res.json({ error: 'Không tìm thấy hóa đơn.' });
                }

                res.json({ receiveBills });
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!'});
        }
    };
}

module.exports = new BillsController();