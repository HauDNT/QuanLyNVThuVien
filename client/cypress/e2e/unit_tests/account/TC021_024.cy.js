describe("Kiểm thử chức năng: Điều chỉnh thông tin cá nhân | Test cases: TC021 - TC024", () => {
    beforeEach(() => {
        cy.login('admin', '12345678').then(() => {
            cy.wait(1000);
            cy.visit('http://localhost:3000/users/edit/1');
        })
    })

    // TC_021: Có nhập email mới
    it('TC_021: Có nhập email mới', () => {
        cy.wait(1000);

        cy.get('input[name="Email"]').clear().type('emailmoi@email.com');
        cy.get('button[type="submit"]').click();

        cy.contains('Đã cập nhật thông tin thành công!').should('be.visible');

        cy.wait(1000);
    })

    // TC_022: Không nhập email mới
    it('TC_022: Không nhập email mới', () => {
        cy.wait(1000);

        cy.get('input[name="Email"]');
        cy.get('button[type="submit"]').click();

        cy.contains('Đã cập nhật thông tin thành công!').should('be.visible');

        cy.wait(1000);
    })

    // TC_023: Email không hợp lệ
    it('TC_023: Email không hợp lệ', () => {
        cy.wait(1000);

        cy.get('input[name="Email"]').clear().type('emailmoi@@@email.com');
        cy.get('button[type="submit"]').click();

        cy.contains('Email không hợp lệ').should('be.visible');

        cy.wait(1000);
    })

    // TC_024: Nhập email dài hơn giới hạn
    it('TC_024: Nhập email dài hơn giới hạn', () => {
        cy.wait(1000);

        cy.get('input[name="Email"]').clear().type('emailmoiiiiiiiiiiiiiiiiiiiiiiiiii@email.com');
        cy.get('button[type="submit"]').click();

        cy.contains('Email không hợp lệ').should('be.visible');

        cy.wait(1000);
    })
})


// Success: 2
// Failed: 2