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
                return res.json({error: `Đã tồn tại mã đăng ký ${allRegisCodes[i]}. Vui lòng thay đổi dãy mã đăng ký khác!`});
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
            const resultFind = await BooksRegisInfo.findAll({
                where: {
                    IndiRegis: 0,
                    BookId: dataApprove.BookId,
                }
            });

            if (resultFind.length) {
                // Cập nhật mã đăng ký đầu tiên vào bản ghi trống tìm được
                await BooksRegisInfo.update({
                    RegisCode: allRegisCodes[0],
                    Status: 0,
                    IndiRegis: 1,
                    Notes: dataApprove.Notes,
                    BillId: dataApprove.BillId,
                    BookId: dataApprove.BookId,
                    UserId: dataApprove.UserId,
                    RoomId: dataApprove.StorePlace,
                    StoreTypeId: dataApprove.StoreTypes,
                    StatusDocId: dataApprove.StatusDoc,
                }, {
                    where: {
                        IndiRegis: 0,
                        BookId: dataApprove.BookId,
                    }
                });

                // Sau đó loại bỏ mã này ra khỏi dữ liệu
                allRegisCodes.splice(0, 1);
            }

            // // Trường hợp 1: Sau khi loại bỏ thì ta tiếp tục insert những phần tử tiếp theo vào:
            // // Trường hợp 2: Nếu không tìm thấy bản ghi trống thì tiếp tục tạo bản ghi mới:
            if (allRegisCodes.length > 0) {
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
            }

            return res.json({success: 'Phân phối sách thành công!'});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi khi phân phối tài liệu. Hãy thử lại sau!'});
        }
    };

    // Xem phân phối của từng biên mục:
    async getApprove(req, res) {
        const bookId = req.params.id;

        try {
            const approve = await BooksRegisInfo.findAll({
                where: {
                    BookId: bookId
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
}

module.exports = new ApproveController();