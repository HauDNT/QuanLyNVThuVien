const {
    Users,
    Rooms,
    StatusDoc,
    StoreTypes,
    BooksRegisInfo,
    Sequelize,
} = require('../models');

class ApproveController {
    // Tìm mã đơn trùng trước khi tạo phân phối:
    async findExist(req, res) {
        const allRegisCodes = req.body.AllRegisCode;
        let isExist;
    
        for (let i = 0; i < allRegisCodes.length; i++) {
            isExist = await BooksRegisInfo.findOne({
                where: {
                    RegisCode: allRegisCodes[i]
                }
            });
    
            if (isExist)
                return res.json({error: `Đã tồn tại mã đăng ký ${allRegisCodes[i]}. Vui lòng thay đổi mã số đăng ký khác!`});
        };
    
        return res.json({success: 'Không có mã nào trùng!'});
    };
    
    // Tạo phân phối:
    async createApprove(req, res) {
        const dataApprove = req.body;
        const allRegisCodes = req.body.AllRegisCode;

        if (!dataApprove) {
            res.json({error: 'Không thể tạo phân phối. Hãy kiểm tra lại thông tin và thử lại sau!'})
            return;
        };

        try {
            for (let i = 0; i < allRegisCodes.length; i++) {
                await BooksRegisInfo.create({
                    RegisCode: allRegisCodes[i],
                    Status: 0,
                    IndiRegis: 1,
                    Notes: dataApprove.Notes,
                    BillId: dataApprove.BillId,
                    BookId: dataApprove.BookId,
                    UserId: dataApprove.UserId,
                    RoomId: dataApprove.StorePlace,
                    StoreTypeId: dataApprove.StoreTypes,
                    StatusDocId: dataApprove.StatusDoc,
                })
            };

            return res.json({success: 'Phân phối sách thành công!'});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi khi phân phối tài liệu. Hãy thử lại sau!'});
        }
    };

    // Lấy toàn bộ phân phối:
    async getAll(req, res) {
        const allApp = await BooksRegisInfo.findAll();
        return res.json({allApp});
    };

    // Xem phân phối của từng biên mục:
    async getApprove(req, res) {
        const bookId = +req.params.bookId;

        try {
            const approve = await BooksRegisInfo.findAll({
                where: {
                    BookId: bookId,
                },
                include: [
                    {
                        model: Users,
                        require: true,
                        where: {id: Sequelize.col('UserId')},
                        attributes: ['username'],
                    },
                    {
                        model: StatusDoc,
                        require: true,
                        where: {id: Sequelize.col('StatusDocId')},
                        attributes: ['Status'],
                    },
                    {
                        model: StoreTypes,
                        require: true,
                        where: {id: Sequelize.col('StoreTypeId')},
                        attributes: ['NameType'],
                    },
                    {
                        model: Rooms,
                        require: true,
                        where: {id: Sequelize.col('RoomId')},
                        attributes: ['RoomName'],
                    },
                ],
                attributes: [
                    'id',
                    'RegisCode',
                    'createdAt',
                    'updatedAt',
                ]
            });
    
            return res.json({approve});
        } catch (error) {
            return res.json({error: 'Không thể tải lên phân phối!'});
        }
    };

    // Xóa phân phối:
    async deleteApprove(req, res) {
        try {
            const approveId = req.params.id;

            await BooksRegisInfo.destroy({
                where: {
                    id: approveId,
                    IndiRegis: 1,
                },
                force: true,
            });

            return res.json({success: 'Xóa phân phối thành công!'});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi trong quá trình xóa phân phối!'});
        }
    };

    // Hàm duyệt phân phối:
    async acceptApprove(req, res) {
        const bookId = +req.params.bookId;

        try {
            await BooksRegisInfo.update(
                {Status: 1},
                {
                where: 
                    {
                        Status: 0,
                        IndiRegis: 1,
                        BookId: bookId,
                    }
                }
            )
    
            return res.json({success: 'Phê duyệt thành công!'});
        } catch (error) {
            return res.json({error: 'Phê duyệt thất bại!'});
        }
    };

    // Hàm lấy số đăng ký lớn nhất hiện tại:
    async getMaxRegisCode(req, res) {
        try {
            const maxRegisCode = await BooksRegisInfo.max('RegisCode');
            const code = +maxRegisCode.slice(5);

            return res.json({code})
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi khi tìm mã!'});
        }
    };

    // Hàm tìm xem có bao nhiêu mã chưa được duyệt trong phân phối của sách có id:
    async isNotAccept(req, res) {
        const bookId = +req.params.bookId;

        const isNotAccept = await BooksRegisInfo.findAll({
            where: {
                IndiRegis: 1,
                Status: 0,
                BookId: bookId,
            }
        });

        return res.json({amount: isNotAccept.length});
    };

    // Lấy thông tin của 1 phân phối:
    async getInfoAnApprove(req, res) {
        try {
            const approveId = +req.params.approveId;
            const info = await BooksRegisInfo.findAll({where: {id: approveId}});
            
            return res.json({info});
        } catch (error) {
            return res.json({error: 'Không thể lấy thông tin của phân phối này!'});
        }
    }
}

module.exports = new ApproveController();