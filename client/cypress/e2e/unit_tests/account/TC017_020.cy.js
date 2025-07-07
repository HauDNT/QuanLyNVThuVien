describe("Kiểm thử chức năng: Điều chỉnh thông tin cá nhân | Test cases: TC017 - TC020", () => {
    beforeEach(() => {
        cy.login('admin', '12345678').then(() => {
            cy.wait(1000);
            cy.visit('http://localhost:3000/users/edit/1');
        })
    })

    // TC_017: Có nhập họ và tên mới
    it('TC_017: Có nhập họ và tên mới', () => {
        cy.wait(1000);

        cy.get('input[name="Fullname"]').clear().type('hovatenmoi');
        cy.get('button[type="submit"]').click();

        cy.contains('Đã cập nhật thông tin thành công!').should('be.visible');

        cy.wait(1000);
    })

    // TC_018: Không nhập họ và tên mới
    it('TC_018: Không nhập họ và tên mới', () => {
        cy.wait(1000);

        cy.get('input[name="Fullname"]');
        cy.get('button[type="submit"]').click();

        cy.contains('Đã cập nhật thông tin thành công!').should('be.visible');

        cy.wait(1000);
    })

    // TC_019: Nhập họ tên dài hơn giới hạn
    it('TC_019: hovatenmoiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii', () => {
        cy.wait(1000);

        cy.get('input[name="Fullname"]').clear().type('hovatenmoiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
        cy.get('button[type="submit"]').click();

        cy.contains('Họ và tên không hợp lệ').should('be.visible');

        cy.wait(1000);

    })

    // TC_020: Nhập họ tên ngắn hơn giới hạn
    it('TC_020: Nhập họ tên ngắn hơn giới hạn', () => {
        cy.wait(1000);

        cy.get('input[name="Fullname"]').clear().type('ten');
        cy.get('button[type="submit"]').click();

        cy.contains('Họ và tên không hợp lệ').should('be.visible');

        cy.wait(1000);

    })
})

// Pass: 2
// Fail: 2