describe("Kiểm thử chức năng: Tạo tài khoản | Test cases: TC063 - TC064", () => {
    beforeEach(() => {
        cy.login('admin', '12345678').then(() => {
            cy.wait(1000);
            cy.visit('http://localhost:3000/users/create');
        })
    })

    // TC_063: Chọn loại tài khoản
    it('TC_063: Chọn loại tài khoản', () => {
        cy.wait(1000);
        cy.get('input[name="username"]').clear().type('username_123');
        cy.get('input[name="password"]').clear().type('12345678');
        cy.get('input[name="repassword"]').clear().type('12345678');
        cy.get('select[name="role"]').select(2);

        cy.get('button[type="submit"]').click();
        cy.wait(1000);
    })

    // TC_064: Không chọn loại tài khoản
    it('TC_064: Không chọn loại tài khoản', () => {
        cy.wait(1000);
        cy.get('input[name="username"]').clear().type('username_123');
        cy.get('input[name="password"]').clear().type('12345678');
        cy.get('input[name="repassword"]').clear().type('12345678');
        cy.get('select[name="role"]');

        cy.get('button[type="submit"]').click();
        cy.wait(1000);
    })
})

// Success: 2
// Failed: 0