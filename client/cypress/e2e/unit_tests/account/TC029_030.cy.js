describe("Kiểm thử chức năng: Điều chỉnh thông tin cá nhân | Test cases: TC029 - TC030", () => {
    beforeEach(() => {
        cy.login('admin', '12345678').then(() => {
            cy.wait(1000);
            cy.visit('http://localhost:3000/users/edit/1');
        })
    })

    // TC_029: Có thay đổi ngày sinh
    it('TC_029: Có thay đổi ngày sinh', () => {
        cy.wait(1000);

        // Nhập ngày theo định dạng yyyy-mm-dd
        cy.get('input[name="Birthday"]').clear().type('2003-01-18');

        cy.get('button[type="submit"]').click();

        cy.contains('Đã cập nhật thông tin thành công!').should('be.visible');

        cy.wait(1000);
    });


    // TC_030: Không thay đổi ngày sinh mới
    it('TC_030: Không thay đổi ngày sinh mới', () => {
        cy.wait(1000);

        cy.get('input[name="Birthday"]');
        cy.get('button[type="submit"]').click();

        cy.contains('Đã cập nhật thông tin thành công!').should('be.visible');

        cy.wait(1000);
    })
})


// Success: 2
// Failed: 0