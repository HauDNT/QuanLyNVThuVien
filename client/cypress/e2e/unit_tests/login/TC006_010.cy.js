describe('Kiểm thử chức năng đăng nhập | Test case: TC006 - TC010', () => {
    // Truy cập vào trang đăng nhập trước khi test
    beforeEach(() => {
        cy.visit('http://localhost:3000/login')
    })

    // TC_006: Nhập đúng mật khẩu
    it('TC_006: Nhập đúng mật khẩu', () => {
        cy.get('input[name="username"]').type('admin');
        cy.wait(1000);

        cy.get('input[name="password"]').type('12345678');
        cy.wait(1000);

        cy.get('button[type="submit"]').click();
        cy.wait(1000);

        cy.contains("LIBTECH").should('be.visible');

        // cy.pause();
    });

    // TC_007: Bỏ trống mật khẩu
    it('TC_007: Bỏ trống mật khẩu', () => {
        cy.visit('http://localhost:3000/login');

        cy.get('input[name="username"]').type('admin');
        cy.wait(1000);

        cy.get('input[name="password"]').clear();
        cy.wait(1000);

        cy.get('button[type="submit"]').click();

        cy.contains('Vui lòng nhập mật khẩu');

        // cy.pause();
    });

    // TC_008: Nhập sai mật khẩu
    it('TC_008: Nhập sai mật khẩu', () => {
        cy.get('input[name="username"]').type('admin');
        cy.wait(1000);

        cy.get('input[name="password"]').type('123456789');
        cy.wait(1000);

        cy.get('button[type="submit"]').click();

        cy.contains('Tài khoản không tồn tại. Vui lòng kiểm tra và thử lại');

        // cy.pause();
    });

    // TC_009: Nhập mật khẩu dài hơn giới hạn
    it('TC_009: Nhập mật khẩu dài hơn giới hạn', () => {
        cy.get('input[name="username"]').type('admin');
        cy.wait(1000);

        cy.get('input[name="password"]').type('123456789123456000');
        cy.wait(1000);

        cy.get('button[type="submit"]').click();

        cy.contains('Mật khẩu không hợp lệ');

        // cy.pause();
    });

    // TC_010: Nhập mật khẩu không có ký tự đặc biệt
    it('TC_010: Nhập mật khẩu ngắn hơn giới hạn', () => {
        cy.get('input[name="username"]').type('admin');
        cy.wait(1000);

        cy.get('input[name="password"]').type('123');
        cy.wait(1000);

        cy.get('button[type="submit"]').click();

        cy.contains('Mật khẩu không hợp lệ');

        // cy.pause();
    });

    // Success: 2
    // Failed: 3
})