const {StatusDoc, BooksRegisInfo} = require('../models');

class StatusdocController {
    async getStatusDoc(req, res) {
        try {
            const statuses = await StatusDoc.findAll(
                {attributes: ['id', 'Status']}
            );

            return res.json(statuses);
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!'});
        }
    };

    async createStatusDoc(req, res) {
        try {
            const {status} = req.body;
            await StatusDoc.create({Status: status});

            return res.json({success: "Tạo trạng thái mới thành công!"});
        } catch (error) {
            return res.json({error: "Đã xảy ra lỗi khi tạo trạng thái mới!"});
        }
    };

    async deleteStatusDoc(req, res) {
        const statusId = req.params.id;

        try {
            // Trước khi xóa thì chuyển phân phối sách thuộc trạng thái tài liệu này sang "Không xác định"
            await BooksRegisInfo.update({StatusDocId: 0, Status: 0} , {where: {StatusDocId: statusId}});

            // Sau đó mới xóa:
            await StatusDoc.destroy({
                where: {
                    id: statusId
                },
                force: true,
            });

            return res.json({success: 'Xóa trạng thái thành công! Các phân phối sách thuộc trạng thái này sẽ được chuyển thành "Không xác định"'});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi khi xóa trạng thái. Vui lòng thử lại sau.'})
        }
    };
}

module.exports = new StatusdocController();