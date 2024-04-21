const {Books, BooksRegisInfo} = require('../models');

class BooksController {
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
                        'Status',
                    ]
            });


            if (!allCatalogings)
                return res.json({error: 'Không tìm thấy thông tin biên mục!'});

            return res.json({allCatalogings});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi từ máy chủ. Hãy thử lại sau!'});
        }
    };

    async getInfoCataloging(req, res) {
        try {
            const catalogId = +req.params.id;
            const catalogInfo = await Books.findByPk(catalogId);

            if (!catalogInfo)
                return res.json({error: 'Không tìm thấy thông tin biên mục!'});

            return res.json({catalogInfo});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi từ máy chủ. Hãy thử lại sau!'});
        }
    }

    async createCataloging(req, res) {
        try {
            const catalogingInfo = req.body;

            if (!catalogingInfo) {
                res.json({error: 'Không thể tạo biên mục. Hãy kiểm tra lại thông tin và thử lại sau!'})
                return;
            }
            
            await Books.create({
                ...catalogingInfo
            });

            res.json({success: 'Tạo biên mục thành công!'});

            // await Books.create({
            //     ISBN: catalogingInfo.ISBN,
            //     DDC: catalogingInfo.DDC,
            //     EncryptName: catalogingInfo.EncryptName,
            //     MainTitle: catalogingInfo.MainTitle,
            //     SubTitle: catalogingInfo.SubTitle,
            //     Author: catalogingInfo.Author,
            //     OrtherAuthors: catalogingInfo.OrtherAuthors,
            //     Topic: catalogingInfo.Topic,
            //     Publisher: catalogingInfo.Publisher,
            //     PubPlace: catalogingInfo.PubPlace,
            //     PubYear: catalogingInfo.PubYear,
            //     QuantityCopies: catalogingInfo.QuantityCopies,
            //     Size: catalogingInfo.Size,
            //     UnitPrice: catalogingInfo.UnitPrice,
            //     NumPages: catalogingInfo.NumPages,
            // });
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi từ máy chủ. Hãy thử lại sau!'});
        }
    };
}

module.exports = new BooksController();