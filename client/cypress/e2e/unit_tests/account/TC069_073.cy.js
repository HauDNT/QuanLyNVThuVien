describe("Kiểm thử chức năng: Tạo tài khoản | Test cases: TC069 - TC073", () => {
    beforeEach(() => {
        cy.login('admin', '12345678').then(() => {
            cy.wait(1000);
            cy.visit('http://localhost:3000/users/create');
        })
    })

    // TC_069: Có nhập email mới
    it('TC_069: Có nhập email mới', () => {
        cy.wait(1000);
        cy.get('input[name="username"]').clear().type('username_123');
        cy.get('input[name="password"]').clear().type('12345678');
        cy.get('input[name="repassword"]').clear().type('12345678');
        cy.get('select[name="role"]').select(1);
        cy.get('input[name="fullname"]').clear().type('hovatenmoi');
        cy.get('input[name="email"]').clear().type('emailmoi@email.com');

        cy.get('button[type="submit"]').click();
        cy.contains('Email không hợp lệ').should('not.exist');
        cy.wait(1000);
    })

    // TC_070: Không nhập email mới
    it('TC_070: Không nhập email mới', () => {
        cy.wait(1000);
        cy.get('input[name="username"]').clear().type('username_123');
        cy.get('input[name="password"]').clear().type('12345678');
        cy.get('input[name="repassword"]').clear().type('12345678');
        cy.get('select[name="role"]').select(1);
        cy.get('input[name="fullname"]').clear().type('hovatenmoi');
        cy.get('input[name="email"]');

        cy.get('button[type="submit"]').click();
        cy.contains('Bạn phải nhập Email');
        cy.wait(1000);
    })

    // TC_071: Email không hợp lệ
    it('TC_071: Email không hợp lệ', () => {
        cy.wait(1000);
        cy.get('input[name="username"]').clear().type('username_123');
        cy.get('input[name="password"]').clear().type('12345678');
        cy.get('input[name="repassword"]').clear().type('12345678');
        cy.get('select[name="role"]').select(1);
        cy.get('input[name="fullname"]').clear().type('hovatenmoi');
        cy.get('input[name="email"]').clear().type('emailmoi@@@email.com');

        cy.get('button[type="submit"]').click();
        cy.contains('Email không hợp lệ');
        cy.wait(1000);
    })

    // TC_072: Nhập email dài hơn giới hạn
    it('TC_072: Nhập email dài hơn giới hạn', () => {
        cy.wait(1000);
        cy.get('input[name="username"]').clear().type('username_123');
        cy.get('input[name="password"]').clear().type('12345678');
        cy.get('input[name="repassword"]').clear().type('12345678');
        cy.get('select[name="role"]').select(1);
        cy.get('input[name="fullname"]').clear().type('hovatenmoi');
        cy.get('input[name="email"]').clear().type('emailmoiiiiiiiiiiiiiiiiiiiiiiiiii@email.com');

        cy.get('button[type="submit"]').click();
        cy.contains('Email không hợp lệ');
        cy.wait(1000);
    })

    // TC_073: Nhập email ngắn hơn giới hạn
    it('TC_073: Nhập email ngắn hơn giới hạn', () => {
        cy.wait(1000);
        cy.get('input[name="username"]').clear().type('username_123');
        cy.get('input[name="password"]').clear().type('12345678');
        cy.get('input[name="repassword"]').clear().type('12345678');
        cy.get('select[name="role"]').select(1);
        cy.get('input[name="fullname"]').clear().type('hovatenmoi');
        cy.get('input[name="email"]').clear().type('em@email.com');

        cy.get('button[type="submit"]').click();
        cy.contains('Email không hợp lệ');
        cy.wait(1000);
    })
})

// Success: 4
// Failed: 1