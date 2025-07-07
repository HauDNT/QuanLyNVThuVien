describe('INTEGRATION TEST - Kiểm thử giao diện và trải nghiệm người dùng | Test case: IT001 - IT003', () => {
    // Truy cập vào trang đăng nhập trước khi test
    beforeEach(() => {
        cy.visit('http://localhost:3000/login')
    })

    // IT_001: Gửi thông tin đăng nhập hợp lệ đến server
    it('IT_001: Gửi thông tin đăng nhập hợp lệ đến server', () => {
        cy.intercept('POST', 'http://localhost:3002/users/login', {
            statusCode: 200,
            body: {
                success: "Đăng nhập thành công",
                id: 1,
                username: "admin",
                status: true,
                authenToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWQiOjEsImlhdCI6MTczOTI0NjY4NX0.3siReHwnp6cw2qLLkgqrUfMqePd_EPWAJEoNej5cb7g"
            },
        }).as('loginRequest');

        cy.get('input[name="username"]').type('admin'); // Nhập tài khoản hợp lệ
        cy.get('input[name="password"]').type('12345678'); // Nhập mật khẩu hợp lệ
        cy.get('button[type="submit"]').click(); // Thực hiện đăng nhập

        cy.wait('@loginRequest').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });

        cy.window().then((win) => {
            expect(win.localStorage.getItem('id')).to.eq('1');
            expect(win.localStorage.getItem('username')).to.eq('admin');
            expect(win.localStorage.getItem('status')).to.eq('true');
            expect(win.localStorage.getItem('authenToken')).to.eq("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWQiOjEsImlhdCI6MTczOTI0NjY4NX0.3siReHwnp6cw2qLLkgqrUfMqePd_EPWAJEoNej5cb7g");
        });

        cy.contains('LIBTECH').should('be.visible'); // Kiểm tra xem có chuyển đến trang chính không
    });

    // IT_002: Gửi thông tin đăng nhập không hợp lệ đến server
    it('IT_002: Gửi thông tin đăng nhập không hợp lệ đến server', () => {
        cy.intercept('POST', 'http://localhost:3002/users/login', {
            statusCode: 200,
            body: {
                id: 1,
                username: 'admin',
                status: 'active',
                authenToken: 'some_token',
            },
        }).as('loginRequest');

        cy.get('input[name="username"]').type('admin123'); // Nhập tài khoản không hợp lệ
        cy.get('input[name="password"]').type('password#12312'); // Nhập mật khẩu không hợp lệ
        cy.get('button[type="submit"]').click(); // Thực hiện đăng nhập

        cy.wait('@loginRequest').its('response.statusCode').should('eq', 401); // Kiểm tra phản hồi từ server
    });

    // IT_003: Đăng nhập khi server không phản hồi
    it('IT_003: Đăng nhập khi server không phản hồi', () => {
        cy.pause();

        // Mô phỏng tình huống server không phản hồi
        cy.intercept('POST', 'http://localhost:3002/users/login', {
            statusCode: 500,
            body: {
                error: 'Internal Server Error',
            },
        }).as('loginRequest');

        // Nhập thông tin đăng nhập
        cy.get('input[name="username"]').type('admin'); // Nhập tên tài khoản
        cy.get('input[name="password"]').type('12345678'); // Nhập mật khẩu
        cy.get('button[type="submit"]').click(); // Gửi thông tin đăng nhập

        // Chờ yêu cầu loginRequest hoàn thành
        cy.wait('@loginRequest').then((interception) => {
            // Kiểm tra mã trạng thái
            expect(interception.response.statusCode).to.eq(500);
        });

        // Kiểm tra xem có hiển thị thông báo lỗi không
        cy.contains('Không thể kết nối đến server. Vui lòng thử lại sau').should('be.visible');
    });
});

// Success: 1
// Failed: 2