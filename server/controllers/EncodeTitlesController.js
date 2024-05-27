const {EncryptTitles} = require("../models");
const { Op } = require("sequelize");

class EncodeTitlesController {
    // Lấy bảng mã hóa tên sách:
    async getEncodeTitles(req, res) {
        try {
            const encodeTitles = await EncryptTitles.findAll(
                {
                    attributes: ['Character', 'NumberEncrypt']
                }
            );
            res.json(encodeTitles);
        } catch (error) {
            res.json({error: 'Không lấy được bảng mã hóa tên sách!'});
        }
    };

    // Tạo tên mã hóa mới:
    async createEncodeTitles(req, res) {
        const {Character, NumberEncrypt} = req.body;

        try {
            const isExist = await EncryptTitles.findAll({
                where: {
                    [Op.or]: [
                        {Character: Character},
                        {NumberEncrypt: NumberEncrypt}
                    ]
                }
            });

            if (isExist.length === 0) {
                await EncryptTitles.create({
                    Character: Character,
                    NumberEncrypt: NumberEncrypt,
                });

                return res.json({success: "Thêm tên mã hóa thành công!"});
            }
            else {
                return res.json({error: "Không thể thêm vì đã tồn tại mã & tên mã hóa này!"});
            }
        } catch (error) {
            return res.json({error: "Đã xảy ra lỗi khi thêm tên mã hóa mới!"});
        }
    };

    // Cập nhật 1 tên mã hóa:
    async updateEncodeTitle(req, res) {
        const {Character_new, NumberEncrypt_new, NumberEncrypt_old} = req.body;

        try {
            await EncryptTitles.update(
                {
                    Character: Character_new,
                    NumberEncrypt: NumberEncrypt_new,
                }, {
                    where: {
                        NumberEncrypt: NumberEncrypt_old
                    }
                }
            );

            return res.json({success: 'Cập nhật tên mã hóa thành công!'});
        } catch (error) {
            return res.json({error: "Đã xảy ra lỗi khi cập nhật tên mã hóa!"});
        }
    };

    // Xóa 1 tên mã hóa:
    async deleteEncodeTitle(req, res) {
        const {numberEncrypt} = req.params;

        try {
            await EncryptTitles.destroy({
                where: {
                    NumberEncrypt: numberEncrypt
                },
                force: true,
            });

            return res.json({success: 'Xóa tên mã hóa thành công!'});
        } catch (error) {
            return res.json({success: 'Xóa tên mã hóa thất bại!'});
        }

    };
}

module.exports = new EncodeTitlesController();