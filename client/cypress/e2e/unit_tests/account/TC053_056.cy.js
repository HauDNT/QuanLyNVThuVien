describe("Kiểm thử chức năng: Tạo tài khoản | Test cases: TC053 - TC056", () => {
    beforeEach(() => {
        cy.login('admin', '12345678').then(() => {
            cy.wait(1000);
            cy.visit('http://localhost:3000/users/create');
        })
    })

    // TC_053: Nhập đúng mật khẩu
    it('TC_053: Nhập đúng mật khẩu', () => {
        cy.wait(1000);
        cy.get('input[name="username"]').clear().type('username_123');
        cy.get('input[name="password"]').clear().type('12345678');
        cy.get('button[type="submit"]').click();
        cy.wait(1000);
    })

    // TC_054: Bỏ trống mật khẩu
    it('TC_054: Bỏ trống mật khẩu', () => {
        cy.wait(1000);
        cy.get('input[name="username"]').clear().type('username_123');
        cy.get('input[name="password"]');
        cy.get('button[type="submit"]').click();
        cy.contains('Vui lòng nhập mật khẩu');
        cy.wait(1000);
    })

    // TC_055: Nhập mật khẩu dài hơn giới hạn
    it('TC_055: Nhập mật khẩu dài hơn giới hạn', () => {
        cy.wait(1000);
        cy.get('input[name="username"]').clear().type('username_123');
        cy.get('input[name="password"]').clear().type('matkhaumoi@12345678901234567\n');
        cy.get('button[type="submit"]').click();
        cy.contains('Mật khẩu không hợp lệ');
        cy.wait(1000);
    })

    // TC_056: Nhập mật khẩu ngắn hơn giới hạn
    it('TC_056: Nhập mật khẩu ngắn hơn giới hạn', () => {
        cy.wait(1000);
        cy.get('input[name="username"]').clear().type('username_123');
        cy.get('input[name="password"]').clear().type('mk');
        cy.get('button[type="submit"]').click();
        cy.contains('Mật khẩu không hợp lệ');
        cy.wait(1000);
    })
})

// Success: 1
// Failed: 3