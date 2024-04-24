const {Books, BooksRegisInfo, Sequelize} = require('../models');

class BooksController {
    // Lấy một số thông tin biên mục để hiển thị trên trang danh sách:
    async getSomeInfo(req, res) {
        try {
            const allCatalogings = await Books.findAll({
                attributes:
                    [
                        'id',
                        'ISBN',
                        'DDC',
                        'EncryptName',
                        'MainTitle',
                        'SubTitle',
                        'Author',
                        'OrtherAuthors',
                        'Editors',
                        'Publisher',
                        'PubPlace',
                        'PubYear',
                        'Types',
                    ],
                include: [
                    {
                        model: BooksRegisInfo,
                        required: true,
                        attributes: ['Status'],
                        where: { 
                            id: Sequelize.col('Books.id'),
                            IndiRegis: 1,
                        },
                    }
                ],
            });

            if (!allCatalogings)
                return res.json({error: 'Không tìm thấy thông tin biên mục!'});

            return res.json({allCatalogings});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi từ máy chủ. Hãy thử lại sau!'});
        }
    };

    // Lấy thông tin biên mục:
    async getInfoCataloging(req, res) {
        try {
            const catalogId = +req.params.id;
            const catalogInfo = await Books.findByPk(
                    catalogId,
                    {include: [
                        {
                            model: BooksRegisInfo,
                            required: true,
                            where: { id: Sequelize.col('Books.id') }
                        }
                    ],}
                );

            if (!catalogInfo)
                return res.json({error: 'Không tìm thấy thông tin biên mục!'});

            return res.json({catalogInfo});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi từ máy chủ. Hãy thử lại sau!'});
        }
    };

    // Tạo một biên mục mới:
    async createCataloging(req, res) {
        const catalogingInfo = req.body;

        if (!catalogingInfo) {
            res.json({error: 'Không thể tạo biên mục. Hãy kiểm tra lại thông tin và thử lại sau!'})
            return;
        }

        try {    
            const newCatalog = await Books.create({
                ...catalogingInfo
            });

            await BooksRegisInfo.create({
                BookId: +newCatalog.id
            });

            res.json({success: 'Tạo biên mục thành công!'});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi từ máy chủ. Hãy thử lại sau!'});
        }
    };

    // Cập nhật thông tin cho biên mục dựa theo các trường thay đổi bất kỳ:
    async updateCataloging(req, res) {
        const idCatalog = req.params.id;
        const catalogingInfo = req.body;

        if (!catalogingInfo) {
            res.json({error: 'Không thể tạo biên mục. Hãy kiểm tra lại thông tin và thử lại sau!'})
            return;
        }

        try {    
            const fieldsChange = Object.keys(catalogingInfo);
            const valuesChange = Object.values(catalogingInfo);

            for (let i = 0; i < fieldsChange.length; i++) {
                let attributesUpdating = {};
                attributesUpdating[fieldsChange[i]] = valuesChange[i];

                Books.update(attributesUpdating, {where: {id: idCatalog}});
            };

            return res.json({success: 'Đã cập nhật thông tin thành công!'});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi từ máy chủ. Hãy thử lại sau!'});
        }
    };
}

module.exports = new BooksController();