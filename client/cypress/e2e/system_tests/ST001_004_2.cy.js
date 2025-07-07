describe('SYSTEM TEST - Kiểm thử chức năng: Đăng nhập | Test case: ST001 - ST004 (2)', () => {
    // Truy cập vào trang đăng nhập trước khi test
    beforeEach(() => {
        cy.visit('http://localhost:3000/login')
    })

    // ST_001: Đăng nhập thành công với thông tin hợp lệ
    it('ST_001: Đăng nhập thành công với thông tin hợp lệ', () => {
        cy.get('input[name="username"]').type('admin');
        cy.wait(1000);

        cy.get('input[name="password"]').type('12345678');
        cy.wait(1000);

        cy.get('button[type="submit"]').click();
        cy.wait(1000);

        cy.contains("LIBTECH").should('be.visible');

        cy.wait(1000);
    });

    // ST_002: Đăng nhập thất bại với mật khẩu sai
    it('ST_002: Đăng nhập thất bại với mật khẩu sai', () => {
        cy.get('input[name="username"]').type('admin');
        cy.wait(1000);

        cy.get('input[name="password"]').type('123456789');
        cy.wait(1000);

        cy.get('button[type="submit"]').click();

        cy.contains('Tài khoản không tồn tại. Vui lòng kiểm tra và thử lại');

        cy.wait(1000);
    });

    // ST_003: Đăng nhập thất bại với tài khoản không tồn tại
    it('ST_003: Đăng nhập thất bại với tài khoản không tồn tại', () => {
        cy.get('input[name="username"]').type('admin123');
        cy.wait(1000);

        cy.get('input[name="password"]').type('123456789abc');
        cy.wait(1000);

        cy.get('button[type="submit"]').click();

        cy.contains('Tài khoản không tồn tại. Vui lòng kiểm tra và thử lại');

        cy.wait(1000);
    });

    // ST_004: Đăng nhập thất bại khi để trống tên tài khoản hoặc mật khẩu.
    it('ST_004_1: Đăng nhập thất bại khi để trống tên tài khoản', () => {
        cy.visit('http://localhost:3000/login');

        cy.get('input[name="username"]').clear();
        cy.wait(1000);

        cy.get('input[name="password"]').type('12345678');
        cy.wait(1000);

        cy.get('button[type="submit"]').click();

        cy.contains('Tài khoản không tồn tại. Vui lòng kiểm tra và thử lại');

        cy.wait(1000);
    });

    it('ST_004_2: Đăng nhập thất bại khi để trống mật khẩu', () => {
        cy.visit('http://localhost:3000/login');

        cy.get('input[name="username"]').type('admin');
        cy.wait(1000);

        cy.get('input[name="password"]').clear();
        cy.wait(1000);

        cy.get('button[type="submit"]').click();

        cy.contains('Tài khoản không tồn tại. Vui lòng kiểm tra và thử lại');

        cy.wait(1000);
    });
});

// Success: 3
// Failed: 2