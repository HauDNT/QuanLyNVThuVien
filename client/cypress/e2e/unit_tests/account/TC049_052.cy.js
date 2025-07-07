describe("Kiểm thử chức năng: Tạo tài khoản | Test cases: TC049 - TC052", () => {
    beforeEach(() => {
        cy.login('admin', '12345678').then(() => {
            cy.wait(1000);
            cy.visit('http://localhost:3000/users/create');
        })
    })

    // TC_049: Có nhập tên tài khoản
    it('TC_049: Có nhập tên tài khoản', () => {
        cy.wait(1000);
        cy.get('input[name="username"]').clear().type('username_123');
        cy.get('button[type="submit"]').click();
        cy.wait(1000);
    })

    // TC_050: Không nhập tên tài khoản
    it('TC_050: Không nhập tên tài khoản', () => {
        cy.wait(1000);
        cy.get('input[name="username"]');
        cy.get('button[type="submit"]').click();
        cy.contains('Tên tài khoản không được bỏ trống');
        cy.wait(1000);
    })

    // TC_051: Nhập dài hơn giới hạn
    it('TC_051: Nhập dài hơn giới hạn', () => {
        cy.wait(1000);
        cy.get('input[name="username"]').clear().type('username_1234567891234578');
        cy.get('button[type="submit"]').click();
        cy.contains('Tên tài khoản không hợp lệ');
        cy.wait(1000);
    })

    // TC_052: Nhập ngắn hơn giới hạn
    it('TC_052: Nhập ngắn hơn giới hạn', () => {
        cy.wait(1000);
        cy.get('input[name="username"]').clear().type('abc');
        cy.get('button[type="submit"]').click();
        cy.contains('Tên tài khoản không hợp lệ');
        cy.wait(1000);
    })
})

// Success: 1
// Failed: 3