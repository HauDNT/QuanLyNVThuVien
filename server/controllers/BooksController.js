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
                        'ManyAuthors',
                        'Publisher',
                        'PubPlace',
                        'PubYear'
                    ]
            });


            if (!allCatalogings)
                return res.status(500).json({error: 'Đã xảy ra lỗi từ máy chủ. Hãy thử lại sau!'});

            return res.status(200).json({allCatalogings});
        } catch (error) {
            return res.status(500).json({error: 'Đã xảy ra lỗi từ máy chủ. Hãy thử lại sau!'});
        }
    }

    async createCataloging(req, res) {
        try {
            const catalogingInfo = req.body;

            if (!catalogingInfo) {
                res.status(400).json({error: 'Không thể tạo biên mục. Hãy kiểm tra lại thông tin và thử lại sau!'})
                return;
            }
            
            await Books.create({
                ...catalogingInfo
            });

            res.status(200).json({success: 'Tạo biên mục thành công!'});

            // await Books.create({
            //     ISBN: catalogingInfo.ISBN,
            //     DDC: catalogingInfo.DDC,
            //     EncryptName: catalogingInfo.EncryptName,
            //     MainTitle: catalogingInfo.MainTitle,
            //     SubTitle: catalogingInfo.SubTitle,
            //     Author: catalogingInfo.Author,
            //     ManyAuthors: catalogingInfo.ManyAuthors,
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
            return res.status(500).json({error: 'Đã xảy ra lỗi từ máy chủ. Hãy thử lại sau!'});
        }
    };
}

module.exports = new BooksController();