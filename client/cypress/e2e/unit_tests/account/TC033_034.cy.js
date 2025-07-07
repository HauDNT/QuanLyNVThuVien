describe("Kiểm thử chức năng: Điều chỉnh thông tin cá nhân | Test cases: TC033 - TC034", () => {
    beforeEach(() => {
        cy.login('admin', '12345678').then(() => {
            cy.wait(1000);
            cy.visit('http://localhost:3000/users/edit/1');
        })
    })

    // TC_033: Có thay đổi phòng công tác
    it('TC_033: Có thay đổi phòng công tác', () => {
        cy.wait(1000);

        cy.get('select[name="RoomId"]').select(0);

        cy.get('button[type="submit"]').click();

        cy.contains('Đã cập nhật thông tin thành công!').should('be.visible');

        cy.wait(1000);
    });

    // TC_034: Không thay đổi phòng công tác
    it('TC_034: Không thay đổi phòng công tác', () => {
        cy.wait(1000);

        cy.get('select[name="RoomId"]');

        cy.get('button[type="submit"]').click();

        cy.contains('Đã cập nhật thông tin thành công!').should('be.visible');

        cy.wait(1000);
    });
})

// Success: 2
// Failed: 0