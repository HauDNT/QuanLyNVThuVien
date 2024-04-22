const {StatusDoc} = require('../models');

class StatusdocController {
    async getStatusDoc(req, res) {
        try {
            const types = await StatusDoc.findAll(
                {attributes: ['id', 'Status']}
            );

            return res.json({types});
        } catch (error) {
            return res.json({error: 'Đã xảy ra lỗi từ phía máy chủ. Hãy thử lại sau!'});
        }
    };
}

module.exports = new StatusdocController();