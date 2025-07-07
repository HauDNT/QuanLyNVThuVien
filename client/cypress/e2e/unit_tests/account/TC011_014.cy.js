describe('Kiểm thử chức năng: Điều chỉnh thông tin cá nhân | Test case: TC011 - TC036', () => {
    // Truy cập vào trang đăng nhập trước khi test
    beforeEach(() => {
        cy.login('admin', '12345678').then(() => {
            cy.wait(1000);
            cy.visit('http://localhost:3000/users/edit/1');
        });
    });


    // TC_011: Nhập mật khẩu mới hợp lệ
    it('TC_011: Nhập mật khẩu mới hợp lệ', () => {
        cy.wait(1000);  // Chờ cho dữ liệu được render ra input hết
        cy.get('input[name="NewPassword"]').type('12345678');

        cy.get('button[type="submit"]').click();
        cy.contains('Đã cập nhật thông tin thành công!').should('be.visible');

        cy.wait(1000);
    });

    // TC_012: Nhập mật khẩu mới rỗng
    it('TC_012: Nhập mật khẩu mới rỗng', () => {
        cy.wait(1000);  // Chờ cho dữ liệu được render ra input hết
        cy.get('input[name="NewPassword"]').clear();

        cy.get('button[type="submit"]').click();
        cy.contains('Đã cập nhật thông tin thành công!').should('be.visible');

        cy.wait(1000);
    });

    // TC_013: Nhập mật khẩu mới không hợp lệ (dài hơn giới hạn)
    it('TC_013: Nhập mật khẩu mới không hợp lệ (dài hơn giới hạn)', () => {
        cy.wait(1000);  // Chờ cho dữ liệu được render ra input hết
        cy.get('input[name="NewPassword"]').type('matkhaumoi@12345678901234567');

        cy.get('button[type="submit"]').click();
        cy.contains('Mật khẩu không hợp lệ').should('be.visible');

        cy.wait(1000);
    });

    // TC_014: Nhập mật khẩu mới không hợp lệ (ngắn hơn giới hạn)
    it('TC_014: Nhập mật khẩu mới không hợp lệ (ngắn hơn giới hạn)', () => {
        cy.get('input[name="NewPassword"]').type('mk');
        cy.get('button[type="submit"]').click();
        cy.contains('Mật khẩu không hợp lệ').should('be.visible');
    });
});

// Success: 4
// Failed: 0