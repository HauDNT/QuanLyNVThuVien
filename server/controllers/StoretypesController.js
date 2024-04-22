const {StoreTypes} = require('../models');

class StoretypesController {
    async getStoreTypes(req, res) {
        try {
            const types = await StoreTypes.findAll(
                {attributes: ['id', 'NameType']}
            );

            return res.json({types});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!'});
        }
    };
}

module.exports = new StoretypesController();