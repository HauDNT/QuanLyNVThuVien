const {
    Books,
    BooksRegisInfo,
    EncryptTitles,
    Sequelize,
} = require('../models');

class BooksController {
    // Lấy tổng số sách hiện có:
    async getAmountOfBooks(req, res) {
        const amount = await Books.count();
        return res.json(amount);
    }

    // Lấy một số thông tin biên mục để hiển thị trên trang danh sách:
    async getSomeInfo(req, res) {
        try {
            const data = await Books.findAll({
                attributes: [
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
                        },
                    },
                ],
            });

            if (!data)
                return res.json({
                    error: 'Không tìm thấy thông tin biên mục!',
                });

            const allCatalogings = data.map((item) => ({
                id: item.id,
                ISBN: item.ISBN,
                DDC: item.DDC,
                EncryptName: item.EncryptName,
                MainTitle: item.MainTitle,
                SubTitle: item.SubTitle,
                Types: item.Types,
                Author: item.Author,
                OrtherAuthors: item.OrtherAuthors,
                Editors: item.Editors,
                Synopsis: item.Synopsis,
                Publisher: item.Publisher,
                PubPlace: item.PubPlace,
                PubYear: item.PubYear,
                BooksRegisInfos: item.BooksRegisInfos,
            }));

            return res.json(allCatalogings);
        } catch (error) {
            return res.json({
                error: 'Đã xảy ra lỗi từ máy chủ. Hãy thử lại sau!',
            });
        }
    }

    // Lấy thông tin biên mục:
    async getInfoCataloging(req, res) {
        try {
            const catalogId = +req.params.id;

            const catalogInfo = await Books.findByPk(catalogId, {
                include: [
                    {
                        model: BooksRegisInfo,
                        required: true,
                        where: { id: Sequelize.col('Books.id') },
                    },
                ],
            });

            if (!catalogInfo)
                return res.json({
                    error: 'Không tìm thấy thông tin biên mục!',
                });

            return res.json(catalogInfo);
        } catch (error) {
            return res.json({
                error: 'Đã xảy ra lỗi từ máy chủ. Hãy thử lại sau!',
            });
        }
    }

    // Lấy về các biên mục đã duyệt:
    async accessCataloging(req, res) {
        const accessCatalog = await Books.findAll({
            include: [
                {
                    model: BooksRegisInfo,
                    required: true,
                    attributes: ['Status'],
                    where: {
                        id: Sequelize.col('Books.id'),
                        Status: 1,
                    },
                },
            ],
        });

        return res.json(accessCatalog);
    }

    // Lấy về các biên mục chưa duyệt:
    async notAccessCataloging(req, res) {
        const accessCatalog = await Books.findAll({
            include: [
                {
                    model: BooksRegisInfo,
                    required: true,
                    attributes: ['Status'],
                    where: {
                        id: Sequelize.col('Books.id'),
                        Status: 0,
                    },
                },
            ],
        });

        return res.json(accessCatalog);
    }

    // Tạo một biên mục mới:
    async createCataloging(req, res) {
        const catalogingInfo = req.body;

        if (!catalogingInfo) {
            res.json({
                error: 'Không thể tạo biên mục. Hãy kiểm tra lại thông tin và thử lại sau!',
            });
            return;
        }

        try {
            // Tạo 1 biên mục:
            const newCatalog = await Books.create({
                ...catalogingInfo,
            });

            // Sau đó tạo 1 hàng sẵn của sách này trong phân phối
            // để sẵn sàng thêm phân phối sau này
            // Nếu không thêm dòng này thì sách sẽ không hiển thị ở ngoài
            // danh sách biên mục vì ta cần trường Status của sách trong
            // bảng này. Thiếu status thì bản ghi bị mất.
            await BooksRegisInfo.create({
                BookId: +newCatalog.id,
            });

            res.json({ success: 'Tạo biên mục thành công!' });
        } catch (error) {
            return res.json({
                error: 'Đã xảy ra lỗi từ máy chủ. Hãy thử lại sau!',
            });
        }
    }

    // Cập nhật thông tin cho biên mục dựa theo các trường thay đổi bất kỳ:
    async updateCataloging(req, res) {
        const idCatalog = req.params.id;
        const catalogingInfo = req.body;

        if (!catalogingInfo) {
            res.json({
                error: 'Không thể cập nhật biên mục. Hãy kiểm tra lại thông tin và thử lại sau!',
            });
            return;
        }

        try {
            Books.update(catalogingInfo, { where: { id: idCatalog } });

            return res.json({ success: 'Đã cập nhật thông tin thành công!' });
        } catch (error) {
            return res.json({
                error: 'Đã xảy ra lỗi từ máy chủ. Hãy thử lại sau!',
            });
        }
    }

    // Xóa 1 biên mục
    async deleteCataloging(req, res) {
        const idCatalog = req.params.id;
        const catalogingInfo = req.body;

        if (!catalogingInfo) {
            res.json({
                error: 'Không thể xóa biên mục. Hãy kiểm tra lại thông tin và thử lại sau!',
            });
            return;
        }

        try {
            await Books.destroy({ where: { id: idCatalog }, force: true });

            return res.json({ success: 'Xóa biên mục thành công!' });
        } catch (error) {
            return res.json({
                error: 'Đã xảy ra lỗi từ máy chủ. Hãy thử lại sau!',
            });
        }
    }

    // Tìm kiếm theo hạng mục và giá trị:
    async searchCataloging(req, res) {
        const { selectedCategory, searchValue } = req.body;

        try {
            const result = await Books.findAll({
                where: { [selectedCategory]: searchValue },
                include: [
                    {
                        model: BooksRegisInfo,
                        required: true,
                        attributes: ['Status'],
                        where: {
                            id: Sequelize.col('Books.id'),
                        },
                    },
                ],
            });

            return res.json(result);
        } catch (error) {
            return res.json({ error: 'Dữ liệu không hợp lệ!' });
        }
    }

    // Lấy số lượng sách được biên mục trong năm X theo từng tháng:
    async getAmountPerMonthOfYear(req, res) {
        const year = +req.params.year;

        try {
            const data = await Books.findAll({
                attributes: [
                    [Sequelize.literal('YEAR(createdAt)'), 'year'],
                    [Sequelize.literal('MONTH(createdAt)'), 'month'],
                    [Sequelize.literal('COUNT(*)'), 'amount'],
                ],
                where: Sequelize.literal(`YEAR(createdAt) = ${year}`),
                group: ['year', 'month'],
                order: [['year'], ['month']],
            });

            return res.json(data);
        } catch (error) {
            return res.json({ error: 'Đã xảy ra lỗi khi lấy dữ liệu!' });
        }
    }
}

module.exports = new BooksController();
