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

    // Tạo đơn mới:
    async createBill(req, res) {
        const billInfo = req.body;
        
        try {

            // Kiểm tra data được gửi qua có hợp lệ không?
            if (!billInfo || Object.keys(billInfo).length === 0) {
                return res.json({error: 'Không thể tạo đơn!'});
            };

            // Kiểm tra mã đơn hàng có bị trùng không?
            const checkNumberBill = await Bills.findAll({where: {NumberBill: billInfo.numberBill}});

            if (checkNumberBill.length > 0) {
                return res.json({error: 'Đã tồn tại mã đơn này!'});
            };
            
            // Insert to table 'Bills':
            await Bills.create (
                {
                    NumberBill: billInfo.numberBill,
                    NameBill: billInfo.nameBill,
                    Supplier: billInfo.supplierBill,
                    Discount: billInfo.discountBill,
                    DateGenerateBill: billInfo.dateGenerate,
                    Notes: billInfo.notes,
                }
            );

            let getThisBill = await Bills.findOne (
                {
                    attributes: ['id'],
                    where: {NumberBill: billInfo.numberBill},
                }
            );
            // Trả về một object chứa id nên ta phải gọi getThisBill.id để lấy giá trị id ra

            // // Insert to table 'BillToType':
            await BillToType.create (
                {
                    BillId: getThisBill.id,
                    BillTypeId: +billInfo.typeBill, // Giá trị lấy từ select trong Client là chuỗi, thêm dấu + để chuyển nó về số
                }
            );

            return res.json({success: 'Tạo hóa đơn mới thành công!'});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi trong quá trình tạo đơn!'});
        }
    }
}

module.exports = new BillsController();