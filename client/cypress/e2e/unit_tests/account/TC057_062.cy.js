describe("Kiểm thử chức năng: Tạo tài khoản | Test cases: TC057 - TC062", () => {
    beforeEach(() => {
        cy.login('admin', '12345678').then(() => {
            cy.wait(1000);
            cy.visit('http://localhost:3000/users/create');
        })
    })

    // TC_057: Nhập đúng mật khẩu
    it('TC_057: Nhập đúng mật khẩu', () => {
        cy.wait(1000);
        cy.get('input[name="username"]').clear().type('username_123');
        cy.get('input[name="password"]').clear().type('12345678');
        cy.get('input[name="repassword"]').clear().type('12345678');
        cy.get('button[type="submit"]').click();
        cy.wait(1000);
    })

    // TC_058: Bỏ trống mật khẩu
    it('TC_058: Bỏ trống mật khẩu', () => {
        cy.wait(1000);
        cy.get('input[name="username"]').clear().type('username_123');
        cy.get('input[name="password"]').clear().type('12345678');
        cy.get('input[name="repassword"]');
        cy.get('button[type="submit"]').click();
        cy.contains('Vui lòng nhập mật khẩu');
        cy.wait(1000);
    })

    // TC_059: Nhập mật khẩu dài hơn giới hạn
    it('TC_059: Nhập mật khẩu dài hơn giới hạn', () => {
        cy.wait(1000);
        cy.get('input[name="username"]').clear().type('username_123');
        cy.get('input[name="password"]').clear().type('matkhaumoi@12345678901234567');
        cy.get('input[name="repassword"]').clear().type('matkhaumoi@12345678901234567');
        cy.get('button[type="submit"]').click();
        cy.contains('Mật khẩu không hợp lệ');
        cy.wait(1000);
    })

    // TC_060: Nhập mật khẩu ngắn hơn giới hạn
    it('TC_060: Nhập mật khẩu ngắn hơn giới hạn', () => {
        cy.wait(1000);
        cy.get('input[name="username"]').clear().type('username_123');
        cy.get('input[name="password"]').clear().type('mk');
        cy.get('input[name="repassword"]').clear().type('mk');
        cy.get('button[type="submit"]').click();
        cy.contains('Mật khẩu không hợp lệ');
        cy.wait(1000);
    })

    // TC_061: Nhập mật khẩu không trùng khớp
    it('TC_061: Nhập mật khẩu không trùng khớp', () => {
        cy.wait(1000);
        cy.get('input[name="username"]').clear().type('username_123');
        cy.get('input[name="password"]').clear().type('12345678');
        cy.get('input[name="repassword"]').clear().type('123456789');
        cy.get('button[type="submit"]').click();
        cy.contains('Mật khẩu không hợp lệ');
        cy.wait(1000);
    })

    // TC_062: Nhập mật khẩu trùng khớp
    it('TC_062: Nhập mật khẩu trùng khớp', () => {
        cy.wait(1000);
        cy.get('input[name="username"]').clear().type('username_123');
        cy.get('input[name="password"]').clear().type('12345678');
        cy.get('input[name="repassword"]').clear().type('12345678');
        cy.get('button[type="submit"]').click();
        cy.contains('Mật khẩu không hợp lệ').should('not.exist');
        cy.wait(1000);
    })
})

// Success: 2
// Failed: 4