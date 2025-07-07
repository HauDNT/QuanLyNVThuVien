describe('Kiểm thử chức năng đăng nhập | Test case: TC001 - TC005', () => {
    // Truy cập vào trang đăng nhập trước khi test
    beforeEach(() => {
        cy.visit('http://localhost:3000/login')
    })

    // TC_001: Nhập tài khoản hợp lệ
    it('TC_001: Nhập tài khoản hợp lệ', () => {
        cy.get('input[name="username"]').type('admin');
        cy.wait(1000);

        cy.get('input[name="password"]').type('12345678');
        cy.wait(1000);

        cy.get('button[type="submit"]').click();
        cy.wait(1000);

        cy.contains("LIBTECH").should('be.visible');

        // cy.pause();
        cy.wait(3000);
    });

    // TC_002: Bỏ trống tài khoản
    it('TC_002: Bỏ trống tài khoản', () => {
        cy.visit('http://localhost:3000/login');

        cy.get('input[name="username"]').clear();
        cy.wait(1000);

        cy.get('input[name="password"]').type('12345678');
        cy.wait(1000);

        cy.get('button[type="submit"]').click();

        cy.contains('Vui lòng nhập tên tài khoản');

        // cy.pause();
        cy.wait(1000);
    });

    // TC_003: Nhập sai tên tài khoản
    it('TC_003: Nhập sai tên tài khoản', () => {
        cy.get('input[name="username"]').type('abc@123');
        cy.wait(1000);

        cy.get('input[name="password"]').type('12345678');
        cy.wait(1000);

        cy.get('button[type="submit"]').click();

        cy.contains('Tài khoản không tồn tại. Vui lòng kiểm tra và thử lại');

        // cy.pause();
        cy.wait(1000);
    });

    // TC_004: Nhập tài khoản dài hơn giới hạn
    it('TC_004: Nhập tài khoản dài hơn giới hạn', () => {
        cy.get('input[name="username"]').type('username@1234567890123456');
        cy.wait(1000);

        cy.get('button[type="submit"]').click();
        cy.contains('Tên tài khoản không hợp lệ');

        // cy.pause();
        cy.wait(1000);
    });

    // TC_005: Nhập tài khoản ngắn hơn giới hạn
    it('TC_005: Nhập tài khoản ngắn hơn giới hạn', () => {
        cy.get('input[name="username"]').type('123');
        cy.wait(1000);

        cy.get('button[type="submit"]').click();
        cy.contains('Tên tài khoản không hợp lệ');

        // cy.pause();
        cy.wait(1000);
    });

    // Success: 2
    // Failed: 3
})