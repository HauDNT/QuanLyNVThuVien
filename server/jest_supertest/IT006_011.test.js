const request = require('supertest');
const app = require('../index');

describe('Chức năng: Điều chỉnh thông tin cá nhân', () => {
    it('IT_006: Gửi thông tin hợp lệ đến máy chủ.', async () => {
        const res = await request(app)
            .put("/users/updateinfo/1")
            .set("authenToken", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWQiOjEsImlhdCI6MTc0MDEyNTQ0MH0.ijhQo-HLkfMSgHl0SzNerF4Z8zLfpQKixS1EH3ySA5M")
            .send({
                user_id: 1,
                new_password: "12345678",
                role_id: 1,
                fullname: "Admin",
                email: "admin@email.com",
                phone_number: "0941222440",
                birthday: "01/18/2003",
                permission_id: 1,
                room_id: 1,
            });

        console.log("Response Status:", res.status);
        console.log("Response Body:", res.body);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success");
    });
});
