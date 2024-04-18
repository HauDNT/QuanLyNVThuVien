const {Bills, BillToType, BillTypes, sequelize} = require('../models');

class BillsController {
    // Lấy toàn bộ hóa đơn:
    async getAllBills(req, res) {
        try {
            const getBills = await Bills.findAll();
            return res.json({bills: getBills});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!'});
        }
    };

    async getTypes(req, res) {
        try {
            const types = await BillTypes.findAll();
            return res.json({listTypes: types});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!'});
        }
    }

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

    // Lấy số lượng đơn hiện tại:
    async countAmountOfBills(req, res) {
        try {
            const amountBills = await Bills.findAll({
                attributes: [
                    [sequelize.fn('COUNT', sequelize.col('id')), 'billCount']
                ],
                raw: true,
            });
    
            return res.json(amountBills[0].billCount);  // Trả về số lượng đơn
    
        } catch (error) {
            return res.json({ error: 'Đã xảy ra lỗi trong quá trình đếm đơn!' });
        }
    };
    
    // Xóa một đơn theo id (Xóa mềm):
    async deleteBill(req, res) {
        try {
            const billId = req.params.id;
    
            await Bills.destroy({
                where: {
                    id: billId,
                }
            });

            return res.json({success: 'Xóa đơn thành công!'});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi khi xóa đơn. Vui lòng thử lại sau.'})
        }
    }

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