describe('INTEGRATION TEST - Kiểm thử giao diện và trải nghiệm người dùng | Test case: IT012 - IT016', () => {
    beforeEach(() => {
        cy.login('admin', '12345678').then(() => {
            cy.wait(1000);
        })
    })

    // IT_012: Thêm chức vụ mới - Gửi thông tin tên chức vụ hợp lệ đến máy chủ
    it('IT_012: Thêm chức vụ mới - Gửi thông tin tên chức vụ hợp lệ đến máy chủ', () => {
        cy.intercept('POST', 'http://localhost:3002/positions/addPosition', {
            statusCode: 200
        }).as('createPositionRequest');

        cy.visit('http://localhost:3000/positions/');

        cy.get('input[name="positionName"]').type('Trưởng phòng');
        cy.get('button[type="submit"]').click();

        cy.wait('@createPositionRequest').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
    });

    // IT_013: Thêm chức vụ mới - Gửi thông tin tên chức vụ không hợp lệ đến máy chủ
    it('IT_013: Thêm chức vụ mới - Gửi thông tin tên chức vụ không hợp lệ đến máy chủ', () => {
        cy.intercept('POST', 'http://localhost:3002/positions/addPosition', {
            statusCode: 200
        }).as('createPositionRequest');

        cy.visit('http://localhost:3000/positions/');

        cy.get('input[name="positionName"]').type('ábdasbshadbsadhbsadhbdashdbsahbashbasđsa');
        cy.get('button[type="submit"]').click();

        cy.wait('@createPositionRequest').then((interception) => {
            expect(interception.response.statusCode).to.eq(400);
        });
    });

    // IT_014: Thêm chức vụ mới - Gửi thông tin tên chức vụ hợp lệ đến máy chủ khi máy chủ không phản hồi - Tắt ExpressJs trước khi test
    it('IT_014: Thêm chức vụ mới - Gửi thông tin tên chức vụ hợp lệ đến máy chủ khi máy chủ không phản hồi', () => {
        cy.visit('http://localhost:3000/positions/');

        cy.wait(5000); // Tắt server

        cy.get('input[name="positionName"]').type('Trưởng phòng');
        cy.get('button[type="submit"]').click();

        cy.contains('Đã xảy ra lỗi trong quá trình tạo chức vụ mới');
    });
});

// Success: 2
// Failed: 1