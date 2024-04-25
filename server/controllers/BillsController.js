const { Op } = require('sequelize');
const {Bills, BillTypes, Books, BooksRegisInfo, sequelize, Sequelize} = require('../models');

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

    // Lấy loại hóa đơn:
    async getTypes(req, res) {
        try {
            const types = await BillTypes.findAll();
            return res.json({listTypes: types});
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
                            model: BillTypes,
                            required: true,
                            where: {id: type}
                        }
                    ],
                });

                if (!receiveBills) {
                    return res.json({ error: 'Không tìm thấy hóa đơn.' });
                }

                return res.json({ receiveBills });
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!'});
        }
    };

    // Lấy số lượng đơn hiện tại:
    async countAmountOfBills(req, res) {
        try {
            let amountBills = await Bills.max('id', {paranoid: false});
            if (!amountBills)
                amountBills = 0;
            return res.json(amountBills);
        } catch (error) {
            return res.json({ error: 'Đã xảy ra lỗi trong quá trình đếm đơn!' });
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
            const checkNumberBill = await Bills.findAll({where: {id: billInfo.id}});

            if (checkNumberBill.length > 0) {
                return res.json({error: 'Đã tồn tại mã đơn này!'});
            };
            
            // Insert to table 'Bills':
            await Bills.create (
                {
                    id: billInfo.id,
                    NameBill: billInfo.nameBill,
                    Supplier: billInfo.supplierBill,
                    Discount: billInfo.discountBill,
                    DateGenerateBill: billInfo.dateGenerate,
                    Notes: billInfo.notes,
                    BillTypeId: billInfo.typeBill,
                }
            );

            return res.json({success: 'Tạo hóa đơn mới thành công!'});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi trong quá trình tạo đơn!'});
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
    };

    // Lấy danh sách đơn đã bị xóa mềm:
    async getBillSoftDeleted(req, res) {
        const type = +req.params.type;

        try {
            const billDeleted = await Bills
                .findAll({
                    attributes: [
                        'id', 
                        'NameBill',
                        'DateGenerateBill', 
                        'Supplier', 
                        'deletedAt',
                    ],
                    include: [
                        {
                            model: BillTypes,
                            required: true,
                            where: {id: Sequelize.col('BillTypeId')}
                        }
                    ],
                    where: {
                        deletedAt: {
                            [Op.ne]: null,
                        },
                        BillTypeId: type,
                    },
                    paranoid: false,    // Cho phép đưa ra những bản ghi bị Soft Delete
                });

                return res.json({ billDeleted });
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!'});
        }
    };

    // Khôi phục lại hóa đơn đã bị xóa mềm:
    async restoreReachBill(req, res) {
        const {id} = req.params;
        try {
            await Bills.restore (
                {where: {id: +id}},
            );
    
            return res.json({success: 'Đã khôi phục thành công!'});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi trong quá trình khôi phục. Hãy thử lại sau!'});
        }
    };

    // Xóa cứng hóa đơn (Force delete):
    async forceDeleteBill(req, res) {
        try {
            const billId = req.params.id;
    
            await Bills.destroy({
                where: {
                    id: billId,
                },
                force: true,
            });

            return res.json({success: 'Xóa đơn thành công!'});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi khi xóa đơn. Vui lòng thử lại sau.'})
        }
    };

    /* Lấy chi tiết thông tin hóa đơn, bao gồm: 
        + Danh sách các sách thuộc hóa đơn này.
        + Số lượng mỗi quyển sách.
        + Đơn giá mỗi quyển sách.
    */
    async getBillDetail(req, res) {
        const billId = req.params.id;

        const detail = await BooksRegisInfo.findAll(
            {
                attributes: [
                    'BookId',
                    [Sequelize.fn('COUNT', Sequelize.col('BooksRegisInfo.id')), 'Amount']
                ],
                include: [
                    {
                        model: Books,
                        // attributes: ['MainTitle', 'UnitPrice'],
                        where: {id: Sequelize.col('BooksRegisInfo.BookId')},
                    },
                    {
                        model: Bills,
                        // attributes: ['Discount'],
                        where: {id: Sequelize.col('BooksRegisInfo.BillId')},
                    }
                ],
                where: {BillId: billId, Status: 1},
                group: ['BooksRegisInfo.BookId', 'BooksRegisInfo.BillId'],
            }
        );

        res.json({detail});
    };
}

module.exports = new BillsController();