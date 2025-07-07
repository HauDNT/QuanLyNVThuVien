describe("Kiểm thử chức năng: Điều chỉnh thông tin cá nhân | Test cases: TC025 - TC028", () => {
    beforeEach(() => {
        cy.login('admin', '12345678').then(() => {
            cy.wait(1000);
            cy.visit('http://localhost:3000/users/edit/1');
        })
    })

    // TC_025: Có nhập số điện thoại mới
    it('TC_025: Có nhập số điện thoại mới', () => {
        cy.wait(1000);

        cy.get('input[name="PhoneNumber"]').clear().type('0941222449');
        cy.get('button[type="submit"]').click();

        cy.contains('Đã cập nhật thông tin thành công!').should('be.visible');

        cy.wait(1000);
    })

    // TC_026: Không nhập số điện thoại mới
    it('TC_026: Không nhập số điện thoại mới', () => {
        cy.wait(1000);

        cy.get('input[name="PhoneNumber"]');
        cy.get('button[type="submit"]').click();

        cy.contains('Đã cập nhật thông tin thành công!').should('be.visible');

        cy.wait(1000);
    })

    // TC_027: Số điện thoại không hợp lệ
    it('TC_027: Số điện thoại không hợp lệ', () => {
        cy.wait(1000);

        cy.get('input[name="PhoneNumber"]').clear().type('0941222449@@');
        cy.get('button[type="submit"]').click();

        cy.contains('Số điện thoại không hợp lệ').should('be.visible');

        cy.wait(1000);
    })

    // TC_028: Nhập số điện thoại dài hơn giới hạn
    it('TC_028: Nhập số điện thoại dài hơn giới hạn', () => {
        cy.wait(1000);

        cy.get('input[name="PhoneNumber"]').clear().type('0941222449999999999999999999999999999999');
        cy.get('button[type="submit"]').click();

        cy.contains('Số điện thoại không hợp lệ').should('be.visible');

        cy.wait(1000);
    })
})


// Success: 2
// Failed: 2