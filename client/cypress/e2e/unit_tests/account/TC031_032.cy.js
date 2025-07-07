describe("Kiểm thử chức năng: Điều chỉnh thông tin cá nhân | Test cases: TC031 - TC032", () => {
    beforeEach(() => {
        cy.login('admin', '12345678').then(() => {
            cy.wait(1000);
            cy.visit('http://localhost:3000/users/edit/1');
        })
    })

    // TC_031: Có thay đổi chức vụ
    it('TC_031: Có thay đổi chức vụ', () => {
        cy.wait(1000);

        cy.get('select[name="PositionId"]').select(1);

        cy.get('button[type="submit"]').click();

        cy.contains('Đã cập nhật thông tin thành công!').should('be.visible');

        cy.wait(1000);
    });


    // TC_032: Không thay đổi chức vụ
    it('TC_032: Không thay đổi chức vụ', () => {
        cy.wait(1000);

        cy.get('select[name="PositionId"]');
        cy.get('button[type="submit"]').click();

        cy.contains('Đã cập nhật thông tin thành công!').should('be.visible');

        cy.wait(1000);
    })
})


// Success: 2
// Failed: 0