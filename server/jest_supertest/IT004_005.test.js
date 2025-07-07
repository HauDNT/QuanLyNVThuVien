const request = require('supertest');
const app = require('../index');

describe('Chức năng: Tích hợp chức năng đăng nhập với cơ sở dữ liệu', () => {
    it('IT_004: Kiểm tra thông tin đăng nhập hợp lệ.', async () => {
        const res = await request(app)
            .post("/users/login")
            .send({
                username: "admin",
                password: "12345678",
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('IT_005: Kiểm tra thông tin đăng nhập không tồn tại trong cơ sở dữ liệu.', async () => {
        const res = await request(app)
            .post("/users/login")
            .send({
                username: "admin123",
                password: "password#12312",
            });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("message", "Unauthorized");
    });


});
