const {StoreTypes, BooksRegisInfo} = require('../models');

class StoretypesController {
    async getStoreTypes(req, res) {
        try {
            const types = await StoreTypes.findAll(
                {attributes: ['id', 'NameType']}
            );

            return res.json(types);
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!'});
        }
    };

    async createStoreType(req, res) {
        try {
            const {nameType} = req.body;
            await StoreTypes.create({NameType: nameType});

            return res.json({success: "Tạo thể loại mới thành công!"});
        } catch (error) {
            return res.json({error: "Đã xảy ra lỗi khi tạo thể loại mới!"});
        }
    };

    async deleteStoreType(req, res) {
        const typeId = req.params.id;

        try {
            // Trước khi xóa thì chuyển phân phối sách thuộc thể loại lưu trữ này sang "Không xác định"
            await BooksRegisInfo.update({StoreTypeId: 0, Status: 0} , {where: {StoreTypeId: typeId}});

            // Sau đó mới xóa thể loại:
            await StoreTypes.destroy({
                where: {
                    id: typeId
                },
                force: true,
            });

            return res.json({success: 'Xóa thể loại thành công! Các phân phối sách thuộc thể loại này sẽ được chuyển thành "Không xác định"'});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi khi xóa thể loại. Vui lòng thử lại sau.'})
        }
    };
}

module.exports = new StoretypesController();