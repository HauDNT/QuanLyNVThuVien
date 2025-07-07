describe("Kiểm thử chức năng: Tạo tài khoản | Test cases: TC065 - TC068", () => {
    beforeEach(() => {
        cy.login('admin', '12345678').then(() => {
            cy.wait(1000);
            cy.visit('http://localhost:3000/users/create');
        })
    })

    // TC_065: Có nhập họ và tên mới
    it('TC_065: Có nhập họ và tên mới', () => {
        cy.wait(1000);
        cy.get('input[name="username"]').clear().type('username_123');
        cy.get('input[name="password"]').clear().type('12345678');
        cy.get('input[name="repassword"]').clear().type('12345678');
        cy.get('select[name="role"]').select(1);
        cy.get('input[name="fullname"]').clear().type('hovatenmoi');

        cy.get('button[type="submit"]').click();
        cy.contains('Họ và tên không hợp lệ').should('not.exist');
        cy.wait(1000);
    })

    // TC_066: Không nhập họ và tên mới
    it('TC_066: Không nhập họ và tên mới', () => {
        cy.wait(1000);
        cy.get('input[name="username"]').clear().type('username_123');
        cy.get('input[name="password"]').clear().type('12345678');
        cy.get('input[name="repassword"]').clear().type('12345678');
        cy.get('select[name="role"]').select(1);
        cy.get('input[name="fullname"]');

        cy.get('button[type="submit"]').click();
        cy.contains('Bạn phải nhập họ và tên');
        cy.wait(1000);
    })

    // TC_067: Nhập họ tên dài hơn giới hạn
    it('TC_067: Nhập họ tên dài hơn giới hạn', () => {
        cy.wait(1000);
        cy.get('input[name="username"]').clear().type('username_123');
        cy.get('input[name="password"]').clear().type('12345678');
        cy.get('input[name="repassword"]').clear().type('12345678');
        cy.get('select[name="role"]').select(1);
        cy.get('input[name="fullname"]').clear().type('hovatenmoiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');

        cy.get('button[type="submit"]').click();
        cy.contains('Họ và tên không hợp lệ');
        cy.wait(1000);
    })

    // TC_068: Nhập họ tên ngắn hơn giới hạn
    it('TC_068: Nhập họ tên ngắn hơn giới hạn', () => {
        cy.wait(1000);
        cy.get('input[name="username"]').clear().type('username_123');
        cy.get('input[name="password"]').clear().type('12345678');
        cy.get('input[name="repassword"]').clear().type('12345678');
        cy.get('select[name="role"]').select(1);
        cy.get('input[name="fullname"]').clear().type('ten');

        cy.get('button[type="submit"]').click();
        cy.contains('Họ và tên không hợp lệ');
        cy.wait(1000);
    })
})

// Success: 2
// Failed: 0