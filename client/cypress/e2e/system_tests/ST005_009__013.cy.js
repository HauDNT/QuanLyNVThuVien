describe('SYSTEM TEST - Kiểm thử chức năng: Đăng nhập | Test case: ST005 - ST010', () => {
    // Truy cập vào trang đăng nhập trước khi test
    beforeEach(() => {
        cy.visit('http://localhost:3000/login')
    })

    // ST_005: Hiển thị đúng các thành phần giao diện.
    it('ST_005: Hiển thị đúng các thành phần giao diện.', () => {
        cy.get('input[name="username"]').type('admin');
        cy.wait(1000);

        cy.get('input[name="password"]').type('12345678');
        cy.wait(1000);

        cy.get('button[type="submit"]')
            .should('be.visible')
            .should('be.enabled')
            .click();

        cy.wait(1000);
    });

    // ST_006: Kiểm tra phản hồi của nút "Đăng nhập".
    it('ST_006: Kiểm tra phản hồi của nút "Đăng nhập".', () => {
        cy.get('input[name="username"]').type('admin');
        cy.wait(1000);

        cy.get('input[name="password"]').type('12345678');
        cy.wait(1000);

        cy.get('button[type="submit"]')
            .should('be.visible')
            .should('be.enabled')
            .click();

        cy.wait(1000);
    });

    // ST_007: Kiểm tra nút "Đăng nhập" khi nhập dữ liệu không đầy đủ.
    it('ST_007: Kiểm tra nút "Đăng nhập" khi nhập dữ liệu không đầy đủ.', () => {
        cy.get('input[name="username"]').clear();
        cy.wait(1000);

        cy.get('input[name="password"]').type('12345678');
        cy.wait(1000);

        cy.get('button[type="submit"]')
            .should('be.visible')
            .should('be.enabled')
            .click();

        cy.contains('Vui lòng nhập vào tài khoản')

        cy.wait(1000);
    });

    // ST_008: Kiểm tra tính năng hiển thị/ẩn mật khẩu.
    it('ST_008: Kiểm tra tính năng hiển thị/ẩn mật khẩu.', () => {
        cy.get('input[name="username"]').clear();
        cy.wait(1000);

        cy.get('input[name="password"]').type('12345678');
        cy.wait(1000);

        // 1. Kiểm tra trạng thái ban đầu: type là "password"
        cy.get('input[name="password"]')
            .should('have.attr', 'type', 'password');

        // 2. Click nút toggle và kiểm tra type đổi thành "text"
        cy.get('#toggleVisibility').click();
        cy.get('input[name="password"]')
            .should('have.attr', 'type', 'text');

        // 3. Click lại nút toggle và kiểm tra type quay về "password"
        cy.get('#toggleVisibility').click();
        cy.get('input[name="password"]')
            .should('have.attr', 'type', 'password');

        cy.wait(1000);
    });

    // ST_009: Kiểm tra thông báo nếu đăng nhập không thành công.
    it('ST_009: Kiểm tra thông báo nếu đăng nhập không thành công.', () => {
        cy.get('input[name="username"]').clear().type('admin');
        cy.wait(1000);

        cy.get('input[name="password"]').type('123456789');
        cy.wait(1000);

        cy.get('button[type="submit"]').click();

        cy.contains('Tài khoản không tồn tại')

        cy.wait(1000);
    });

    // ST_013: Tốc độ xử lý đăng nhập.
    it('ST_013: Tốc độ xử lý đăng nhập.', () => {
        const startTime = Date.now(); // Lấy thời gian bắt đầu

        cy.request({
            method: 'POST',
            url: 'http://localhost:3002/users/login',
        }).then((response) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            cy.log(`Tốc độ phản hồi: ${responseTime} ms`);
            expect(responseTime).to.be.lessThan(3000);
        });
    });
});
