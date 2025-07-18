const {
    Users,
    Rooms,
    StatusDoc,
    StoreTypes,
    BooksRegisInfo,
    Sequelize,
} = require('../models');

const { Op } = require('sequelize');

class ApproveController {
    // Tìm mã đơn trùng trước khi tạo phân phối:
    async findExist(req, res) {
        const allRegisCodes = req.body.AllRegisCode;
        let isExist;

        for (let i = 0; i < allRegisCodes.length; i++) {
            isExist = await BooksRegisInfo.findOne({
                where: {
                    RegisCode: allRegisCodes[i],
                },
            });

            if (isExist)
                return res.json({
                    error: `Đã tồn tại mã đăng ký ${allRegisCodes[i]}. Vui lòng thay đổi mã số đăng ký khác!`,
                });
        }

        return res.json({ success: 'Không có mã nào trùng!' });
    }

    // Tạo phân phối:
    async createApprove(req, res) {
        const dataApprove = req.body;
        const allRegisCodes = req.body.AllRegisCode;

        if (!dataApprove) {
            res.json({
                error: 'Không thể tạo phân phối. Hãy kiểm tra lại thông tin và thử lại sau!',
            });
            return;
        }

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
                });
            }

            return res.json({ success: 'Phân phối sách thành công!' });
        } catch (error) {
            return res.json({
                error: 'Đã xảy ra lỗi khi phân phối tài liệu. Hãy thử lại sau!',
            });
        }
    }

    // Lấy toàn bộ phân phối:
    async getAllApproves(req, res) {
        const allApp = await BooksRegisInfo.findAll();
        return res.json(allApp);
    }

    // Lấy tổng số phân phối ~ tổng số sách hiện có:
    async getAmountApproves(req, res) {
        const amount = await BooksRegisInfo.count({ where: { IndiRegis: 1 } });
        return res.json(amount);
    }

    // Xem phân phối của từng biên mục sách:
    async getApproveOfBook(req, res) {
        const bookId = +req.params.bookId;

        try {
            const data = await BooksRegisInfo.findAll({
                where: {
                    BookId: bookId,
                },
                include: [
                    {
                        model: Users,
                        require: true,
                        where: { id: Sequelize.col('UserId') },
                    },
                    {
                        model: StatusDoc,
                        require: true,
                        where: { id: Sequelize.col('StatusDocId') },
                        attributes: ['Status'],
                    },
                    {
                        model: StoreTypes,
                        require: true,
                        where: { id: Sequelize.col('StoreTypeId') },
                        attributes: ['NameType'],
                    },
                    {
                        model: Rooms,
                        require: true,
                        where: { id: Sequelize.col('RoomId') },
                        attributes: ['RoomName'],
                    },
                ],
                attributes: ['id', 'RegisCode', 'createdAt', 'updatedAt'],
            });

            if (!data) {
                return res.json({ error: 'Không tìm thấy phân phối của sách' });
            }

            console.log('Data length: ' + data.length);

            const approve = data.map((item) => ({
                id: item.id,
                RegisCode: item.RegisCode,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                Username: item.User.Username,
                Status: item.StatusDoc.Status,
                NameType: item.StoreType.NameType,
                RoomName: item.Room.RoomName,
            }));

            return res.json(approve);
        } catch (error) {
            return res.json({ error: 'Không thể tải lên phân phối!' });
        }
    }

    // Xem phân phối theo các ngày trong 1 tháng cụ thể trong 1 năm:
    async getApprovePerday(req, res) {
        const month = req.params.month;
        const year = req.params.year;

        let data = await BooksRegisInfo.findAll({
            attributes: [
                [Sequelize.literal('DAY(createdAt)'), 'day'],
                [Sequelize.literal('MONTH(createdAt)'), 'month'],
                [Sequelize.literal('YEAR(createdAt)'), 'year'],
                [Sequelize.literal('COUNT(id)'), 'amount'],
            ],
            where: Sequelize.literal(
                `YEAR(createdAt) = ${year} AND MONTH(createdAt) = ${month} AND Status = 1`
            ),
            group: ['day', 'year', 'month'],
        });

        // Nếu tháng đó có ngày phân phối thì trả về data
        if (data.length > 0) {
            return res.json(data);
        };

        // Còn không thì tạo 1 data như sau:
        // day: 0 => không có ngày nào
        // month, year theo đã chọn
        // amount là 0 vì không có
        data = [
            {
                day: 0,
                month: month,
                year: year,
                amount: 0,
            },
        ];

        return res.json(data);
    }

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

            return res.json({ success: 'Xóa phân phối thành công!' });
        } catch (error) {
            return res.json({
                error: 'Đã xảy ra lỗi trong quá trình xóa phân phối!',
            });
        }
    }

    // Hàm duyệt phân phối:
    async acceptApprove(req, res) {
        const bookId = +req.params.bookId;

        try {
            await BooksRegisInfo.update(
                { Status: 1 },
                {
                    where: {
                        Status: 0,
                        IndiRegis: 1,
                        BookId: bookId,
                    },
                }
            );

            return res.json({ success: 'Phê duyệt thành công!' });
        } catch (error) {
            return res.json({ error: 'Phê duyệt thất bại!' });
        }
    }

    // Hàm lấy số đăng ký lớn nhất hiện tại:
    async getMaxRegisCode(req, res) {
        const { header } = req.params;

        try {
            const maxRegisCode =
                (await BooksRegisInfo.count({
                    where: {
                        RegisCode: {
                            [Op.like]: `${header}%`,
                        },
                    },
                })) + 1;

            return res.json(maxRegisCode);
        } catch (error) {
            return res.json({ error: 'Đã xảy ra lỗi khi tìm mã!' });
        }
    }

    // Hàm lấy số lượng các phân phối đã được duyệt:
    async allAccept(req, res) {
        try {
            const accept = await BooksRegisInfo.findAll({
                where: {
                    IndiRegis: 1,
                    Status: 1,
                },
            });

            return res.json(accept.length);
        } catch (error) {
            return res.json({
                error: 'Không thể lấy thông tin của phân phối này!',
            });
        }
    }

    // Hàm lấy số lượng các phân phối chưa được duyệt:
    async notAccept(req, res) {
        try {
            const notAccept = await BooksRegisInfo.findAll({
                where: {
                    IndiRegis: 1,
                    Status: 0,
                },
            });

            return res.json(notAccept.length);
        } catch (error) {
            return res.json({
                error: 'Không thể lấy thông tin của phân phối này!',
            });
        }
    }

    // Hàm tìm xem có bao nhiêu mã chưa được duyệt trong phân phối của sách có id:
    async bookIsNotAccept(req, res) {
        const bookId = +req.params.bookId;

        try {
            const isNotAccept = await BooksRegisInfo.findAll({
                where: {
                    IndiRegis: 1,
                    Status: 0,
                    BookId: bookId,
                },
            });

            return res.json(isNotAccept.length);
        } catch (error) {
            return res.json({
                error: 'Không thể lấy thông tin của phân phối này!',
            });
        }
    }

    // Lấy thông tin của 1 phân phối:
    async getInfoAnApprove(req, res) {
        try {
            const approveId = +req.params.approveId;
            const info = await BooksRegisInfo.findOne({
                where: { id: approveId },
            });

            return res.json(info);
        } catch (error) {
            return res.json({
                error: 'Không thể lấy thông tin của phân phối này!',
            });
        }
    }

    // Cập nhật thông tin 1 phân phối:
    async updateApprove(req, res) {
        const approveId = +req.params.approveId;
        const approveInfo = req.body;

        if (!approveInfo) {
            res.json({
                error: 'Không thể cập nhật biên mục. Hãy kiểm tra lại thông tin và thử lại sau!',
            });
            return;
        }

        try {
            const fieldsChange = Object.keys(approveInfo);
            const valuesChange = Object.values(approveInfo);

            // Tạo một đối tượng chứa tất cả các trường và giá trị cần cập nhật
            let attributesUpdating = {};
            for (let i = 0; i < fieldsChange.length; i++) {
                attributesUpdating[fieldsChange[i]] = valuesChange[i];
            }

            // Thêm trường Status = 0 để thiết lập chưa duyệt sau khi cập nhật:
            attributesUpdating.Status = 0;

            // Thực hiện cập nhật trong cơ sở dữ liệu
            await BooksRegisInfo.update(attributesUpdating, {
                where: { id: approveId },
            });

            return res.json({ success: 'Đã cập nhật thông tin thành công!' });
        } catch (error) {
            console.error(error);
            return res.json({
                error: 'Đã xảy ra lỗi từ máy chủ. Hãy thử lại sau!',
            });
        }
    }

    // Tìm kiếm trong phân phối (Searchbar):
    async searchInApprove(req, res) {
        const { selectedCategory, searchValue, orderChoice } = req.body;

        try {
            let whereCondition = {
                IndiRegis: 1,
                BookId: orderChoice,
            };

            let includeModels = [
                {
                    model: Users,
                    require: true,
                    where: { id: Sequelize.col('UserId') },
                    attributes: ['Username'],
                },
                {
                    model: StatusDoc,
                    require: true,
                    where: { id: Sequelize.col('StatusDocId') },
                    attributes: ['Status'],
                },
                {
                    model: StoreTypes,
                    require: true,
                    where: { id: Sequelize.col('StoreTypeId') },
                    attributes: ['NameType'],
                },
                {
                    model: Rooms,
                    require: true,
                    where: { id: Sequelize.col('RoomId') },
                    attributes: ['RoomName'],
                },
            ];

            /* 
            Vì một phân phối chứa nhiều thông tin, bao gồm thông tin của model BookRegisInfo lẫn các models khác
            nên ta chia ra thành các case khác nhau tương ứng để xử lý nếu cần truy vấn đến model khác, 
            else cuối cùng là dành cho các dữ liệu có sẵn để truy vấn trong BookRegisInfo
            */

            if (selectedCategory === 'Room') {
                let roomId = await Rooms.findOne({
                    attributes: ['id'],
                    where: { RoomName: searchValue },
                });
                whereCondition.RoomId = roomId.id;
            } else if (selectedCategory === 'StoreType') {
                let storeTypeId = await StoreTypes.findOne({
                    attributes: ['id'],
                    where: { NameType: searchValue },
                });
                whereCondition.StoreTypeId = storeTypeId.id;
            } else if (selectedCategory === 'StatusDoc') {
                let statusId = await StatusDoc.findOne({
                    attributes: ['id'],
                    where: { Status: searchValue },
                });
                whereCondition.StatusDocId = statusId.id;
            } else {
                whereCondition[selectedCategory] = searchValue;
            }

            const data = await BooksRegisInfo.findAll({
                where: whereCondition,
                include: includeModels,
            });

            const result = data.map((item) => ({
                id: item.id,
                RegisCode: item.RegisCode,
                Username: item.User.Username,
                Status: item.StatusDoc.Status,
                NameType: item.StoreType.NameType,
                RoomName: item.Room.RoomName,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
            }));

            return res.json(result);
        } catch (error) {
            return res.json({ error: 'Dữ liệu không hợp lệ!' });
        }
    }
}

module.exports = new ApproveController();
