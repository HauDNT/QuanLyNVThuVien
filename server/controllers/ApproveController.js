const {
    Bills,
    Books,
    Users,
    Rooms,
    StatusDoc,
    StoreTypes,
    BooksRegisInfo,
} = require('../models');

class ApproveController {
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

            if (resultFind) {
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

            // Trường hợp 1: Sau khi loại bỏ thì ta tiếp tục insert những phần tử tiếp theo vào:
            // Trường hợp 2: Nếu không tìm thấy bản ghi trống thì tiếp tục tạo bản ghi mới:
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
            return res.json({error: 'Đã xảy ra lỗi từ máy chủ. Hãy thử lại sau!'});
        }
    };
}

module.exports = new ApproveController();