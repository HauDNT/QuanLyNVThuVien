const { Op } = require('sequelize');
const {Bills, BillTypes, Books, BooksRegisInfo, sequelize, Sequelize} = require('../models');

class BillsController {
    // Lấy toàn bộ hóa đơn:
    async getAllBills(req, res) {
        try {
            const bills = await Bills.findAll();
            return res.json(bills);
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!'});
        }
    };

    // Lấy loại hóa đơn:
    async getTypes(req, res) {
        try {
            const types = await BillTypes.findAll();
            return res.json(types);
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!'});
        }
    };

    // Lấy hóa đơn mua / tặng:
    async getBillOfType(req, res) {
        const type = req.params.type;

        try {
            const bills = await Bills
                .findAll({
                    include: [
                        {
                            model: BillTypes,
                            required: true,
                            where: {id: type}
                        }
                    ],
                });

                if (!bills) {
                    return res.json({ error: 'Không tìm thấy hóa đơn.' });
                }

                return res.json(bills);
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!'});
        }
    };

    // Lấy mã số đơn lớn nhất để tạo mới:
    async getMaxNumberBill(req, res) {
        try {
            let maxNumber = await Bills.max('id', {paranoid: false});
            if (!maxNumber)
                maxNumber = 0;
            return res.json(maxNumber);
        } catch (error) {
            return res.json({ error: 'Đã xảy ra lỗi trong quá trình lấy mã số!' });
        }
    };

    // Lấy số lượng đơn hiện tại:
    async countAmountOfBills(req, res) {
        try {
            let amountBills = await Bills.count({where: {deletedAt: null}});
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

            await BooksRegisInfo.update({Status: 0} , {where: {BillId: billId}});

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
                    include: [{model: BillTypes}],
                    where: {
                        deletedAt: {
                            [Op.ne]: null,
                        },
                        BillTypeId: type,
                    },
                    paranoid: false,    // Cho phép đưa ra những bản ghi bị Soft Delete
                });

                return res.json(billDeleted);
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
        const billId = req.params.billId;

        try {
            const data = await BooksRegisInfo.findAll(
                {
                    attributes: [
                        'BookId',
                        [Sequelize.fn('COUNT', Sequelize.col('BooksRegisInfo.id')), 'Amount']
                    ],
                    include: [
                        {
                            model: Books,
                            attributes: ['MainTitle', 'UnitPrice', 'Author'],
                            where: {id: Sequelize.col('BooksRegisInfo.BookId')},
                        },
                        {
                            model: Bills,
                            attributes: ['Discount'],
                            where: {id: Sequelize.col('BooksRegisInfo.BillId')},
                        }
                    ],
                    where: {BillId: billId, Status: 1},
                    group: ['BooksRegisInfo.BookId', 'BooksRegisInfo.BillId'],
                }
            );
    
            const detail = data.map((item) => (
                {
                    BookId: item.BookId,
                    Amount: item.dataValues.Amount,
                    MainTitle: item.Book.MainTitle,
                    UnitPrice: +item.Book.UnitPrice,
                    Author: item.Book.Author,
                    Discount: +item.Bill.Discount,
                }
            ));
    
            return res.json(detail);
        } catch (error) {
            return res.json({error: 'Dữ liệu không hợp lệ!'});
        };
    };

    // Hàm tìm kiếm hóa đơn theo điều kiện:
    async searchBills(req, res) {
        const {selectedCategory, searchValue, orderChoice} = req.body;

        try {
            const result = await Bills.findAll(
                {
                    where: {[selectedCategory]: searchValue, BillTypeId: orderChoice},
                }
            );

            return res.json(result);
        } catch (error) {
            return res.json({error: 'Dữ liệu không hợp lệ!'});
        }
    };

    // Hàm tìm kiếm thông tin sách trong một hóa đơn:
    async searchBooksOfBill(req, res) {
        const {selectedCategory, searchValue, orderChoice} = req.body;

        try {
            const data = await BooksRegisInfo.findAll(
                {
                    attributes: [
                        'BookId',
                        [Sequelize.fn('COUNT', Sequelize.col('BooksRegisInfo.id')), 'Amount']
                    ],
                    include: [
                        {
                            model: Books,
                            attributes: ['MainTitle', 'UnitPrice', 'Author'],
                            where: {
                                id: Sequelize.col('BooksRegisInfo.BookId'),
                                [selectedCategory]: searchValue,
                            },
                        },
                        {
                            model: Bills,
                            attributes: ['Discount'],
                            where: {id: Sequelize.col('BooksRegisInfo.BillId')},
                        }
                    ],
                    where: {BillId: [orderChoice], Status: 1},
                    group: ['BooksRegisInfo.BookId', 'BooksRegisInfo.BillId'],
                }
            );

            const detail = data.map(item => (
                {
                    BookId: item.BookId,
                    Amount: item.dataValues.Amount,
                    MainTitle: item.Book.MainTitle,
                    UnitPrice: +item.Book.UnitPrice,
                    Author: item.Book.Author,
                    Discount: +item.Bill.Discount,
                }
            ));

            return res.json(detail);
        } catch (error) {
            return res.json({error: 'Dữ liệu không hợp lệ!'});
        }
    };

    // Lấy thông tin của hóa đơn theo mã hóa đơn:
    async getInfoBill(req, res) {
        const billId = req.params.billId;
        const data = await Bills.findByPk(billId);
        return res.json(data);
    };

    // Cập nhật thông tin hóa đơn:
    async updateBill(req, res) {
        const billId = req.params.billId;
        const data = req.body;

        try {
            const fieldsChange = Object.keys(data);
            const valuesChange = Object.values(data);
    
            for (let i = 0; i < fieldsChange.length; i++) {
                let attributesUpdating = {};
                attributesUpdating[fieldsChange[i]] = valuesChange[i];
                Bills.update(
                    attributesUpdating, 
                    {where: {id: billId}}
                );
            };

            return res.json({success: 'Cập nhật thông tin thành công!'})
        } catch (error) {
            res.json({error: 'Không cập nhật được thông tin!'});
        }

    };
}

module.exports = new BillsController();