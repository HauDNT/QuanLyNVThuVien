describe("Kiểm thử chức năng: Điều chỉnh thông tin cá nhân | Test cases: TC015 - TC016", () => {
    beforeEach(() => {
        cy.login('admin', '12345678').then(() => {
            cy.wait(1000);
            cy.visit('http://localhost:3000/users/edit/1');
        })
    })

    // TC_015: Chọn loại tài khoản khác
    it('TC_015: Chọn loại tài khoản khác', () => {
        cy.wait(1000);

        cy.get('select[name="RoleId"]').select(1);
        cy.get('button[type="submit"]').click();

        cy.contains('Đã cập nhật thông tin thành công!').should('be.visible');

        cy.wait(1000);
    })

    // TC_016: Không chọn loại tài khoản khác
    it('TC_016: Không chọn loại tài khoản khác', () => {
        cy.wait(1000);

        // cy.get('select[name="RoleId"]').select(1);
        cy.get('button[type="submit"]').click();

        cy.contains('Đã cập nhật thông tin thành công!').should('be.visible');

        cy.wait(1000);
    })
})

// Pass: 2
// Fail: 0