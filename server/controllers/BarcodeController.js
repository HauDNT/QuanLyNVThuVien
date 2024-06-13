const { Books, BooksRegisInfo, Sequelize } = require('../models');

class BarcodeController {
    async generateBarcode(req, res) {
        const listCode = req.body;
        let notFound = [];
        let isExist;
        let infoBarcodes = [];

        try {
            for (let i = 0; i < listCode.length; i++) {
                // Kiểm tra xem mã hiện tại có tồn tại không? Nếu không thì đưa vào mảng 'notFound':
                isExist = await BooksRegisInfo.findOne({
                    where: { RegisCode: listCode[i] },
                });

                if (!isExist) {
                    notFound.push({
                        RegisCode: listCode[i],
                    });
                } else {
                    let info = await BooksRegisInfo.findOne({
                        where: { RegisCode: listCode[i] },
                        include: [
                            {
                                model: Books,
                                required: true,
                                where: { id: Sequelize.col('BookId') },
                                attributes: ['DDC', 'EncryptName'],
                            },
                        ],
                    });

                    infoBarcodes.push({
                        RegisCode: listCode[i],
                        DDC: info.Book.DDC,
                        EncryptName: info.Book.EncryptName,
                    });
                }
            }

            return res.json({ infoBarcodes, notFound });
        } catch (error) {
            return res.json({
                error: 'Đã xảy ra lỗi trong quá trình tạo barcode!',
            });
        }
    }
}

module.exports = new BarcodeController();
