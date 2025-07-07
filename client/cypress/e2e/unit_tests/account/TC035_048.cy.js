describe("Kiểm thử chức năng: Tìm kiếm tài khoản | Test cases: TC035 - TC048", () => {
    beforeEach(() => {
        cy.login('admin', '12345678').then(() => {
            cy.wait(1000);
            cy.visit('http://localhost:3000/users/');
        })
    })

    // TC_035: Chọn tất cả và không nhập dữ liệu bất kỳ vào text field tìm kiếm
    it('TC_035: Chọn tất cả và không nhập dữ liệu bất kỳ vào text field tìm kiếm', () => {
        cy.wait(1000);

        cy.get('select[name="searchSelect"]').select(0);
        cy.get('button').contains('Tìm kiếm').click();

        cy.get('.accounts-table tbody tr')
            .should('be.visible');

        cy.get('.accounts-table tbody tr').its('length').then((rowCount) => {
            expect(rowCount).to.be.greaterThan(0);
        });

        cy.wait(1000);
    });

    // TC_036: Chọn tất cả & nhập dữ liệu bất kỳ vào text field tìm kiếm
    it('TC_036: Chọn tất cả & nhập dữ liệu bất kỳ vào text field tìm kiếm', () => {
        cy.wait(1000);

        cy.get('select[name="searchSelect"]').select(0);
        cy.get('input[name="search-input"]').clear().type('username1');
        cy.get('button').contains('Tìm kiếm').click();

        cy.get('.accounts-table tbody tr')
            .should('be.visible');

        cy.get('.accounts-table')
            .should('be.visible')
            .and('contain', 'username1');

        cy.contains('Thông tin tìm kiếm không hợp lệ!').should('not.exist');

        cy.wait(1000);
    });

    // TC_037: Chọn "Username" và nhập vào username cần tìm
    it('TC_037: Chọn "Username" và nhập vào username cần tìm', () => {
        cy.wait(1000);

        cy.get('select[name="searchSelect"]').select(1);
        cy.get('input[name="search-input"]').clear().type('username1');
        cy.get('button').contains('Tìm kiếm').click();

        cy.get('.accounts-table tbody tr')
            .should('be.visible');

        cy.get('.accounts-table')
            .should('be.visible')
            .and('contain', 'username1');

        cy.wait(1000);
    });

    // TC_038: Chọn "Username" và không nhập vào username cần tìm
    it('TC_038: Chọn "Username" và không nhập vào username cần tìm', () => {
        cy.wait(1000);

        cy.get('select[name="searchSelect"]').select(1);
        cy.get('input[name="search-input"]');
        cy.get('button').contains('Tìm kiếm').click();

        cy.contains('Thông tin tìm kiếm không hợp lệ!');
        cy.wait(1000);
    });

    // TC_039: Chọn "Họ và tên" và nhập vào họ và tên cần tìm
    it('TC_039: Chọn "Họ và tên" và nhập vào họ và tên cần tìm', () => {
        cy.wait(1000);

        cy.get('select[name="searchSelect"]').select(2);
        cy.get('input[name="search-input"]').clear().type('Nguyễn Văn A');
        cy.get('button').contains('Tìm kiếm').click();

        cy.get('.accounts-table tbody tr')
            .should('be.visible');

        cy.get('.accounts-table')
            .should('be.visible')
            .and('contain', 'Nguyễn Văn A');

        cy.wait(1000);
    });

    // TC_040: Chọn "Họ và tên" và không nhập vào họ và tên cần tìm
    it('TC_040: Chọn "Họ và tên" và không nhập vào họ và tên cần tìm', () => {
        cy.wait(1000);

        cy.get('select[name="searchSelect"]').select(2);
        cy.get('input[name="search-input"]');
        cy.get('button').contains('Tìm kiếm').click();

        cy.contains('Thông tin tìm kiếm không hợp lệ');

        cy.wait(1000);
    });

    // TC_041: Chọn "Email" và nhập vào email cần tìm
    it('TC_041: Chọn "Email" và nhập vào email cần tìm', () => {
        cy.wait(1000);

        cy.get('select[name="searchSelect"]').select(3);
        cy.get('input[name="search-input"]').clear().type('nva@gmail.com');
        cy.get('button').contains('Tìm kiếm').click();

        cy.get('.accounts-table tbody tr')
            .should('be.visible');

        cy.get('.accounts-table')
            .should('be.visible')
            .and('contain', 'nva@gmail.com');

        cy.wait(1000);
    });

    // TC_042: Chọn "Email" và không nhập vào email cần tìm
    it('TC_042: Chọn "Email" và không nhập vào email cần tìm', () => {
        cy.wait(1000);

        cy.get('select[name="searchSelect"]').select(3);
        cy.get('input[name="search-input"]');
        cy.get('button').contains('Tìm kiếm').click();

        cy.contains('Thông tin tìm kiếm không hợp lệ');

        cy.wait(1000);
    });

    // TC_043: Chọn "Số điện thoại" và nhập vào số điện thoại cần tìm
    it('TC_043: Chọn "Số điện thoại" và nhập vào số điện thoại cần tìm', () => {
        cy.wait(1000);

        cy.get('select[name="searchSelect"]').select(4);
        cy.get('input[name="search-input"]').clear().type('0941222449');
        cy.get('button').contains('Tìm kiếm').click();

        cy.get('.accounts-table tbody tr')
            .should('be.visible');

        cy.get('.accounts-table')
            .should('be.visible')
            .and('contain', '0941222449');

        cy.wait(1000);
    });

    // TC_044: Chọn "Số điện thoại" và không nhập vào số điện thoại cần tìm
    it('TC_044: Chọn "Số điện thoại" và không nhập vào số điện thoại cần tìm', () => {
        cy.wait(1000);

        cy.get('select[name="searchSelect"]').select(4);
        cy.get('input[name="search-input"]');
        cy.get('button').contains('Tìm kiếm').click();

        cy.contains('Thông tin tìm kiếm không hợp lệ');

        cy.wait(1000);
    });

    // TC_045: Chọn "Phòng" và nhập vào tên phòng cần tìm
    it('TC_045: Chọn "Phòng" và nhập vào tên phòng cần tìm', () => {
        cy.wait(1000);

        cy.get('select[name="searchSelect"]').select(5);
        cy.get('input[name="search-input"]').clear().type('Phòng nghiệp vụ');
        cy.get('button').contains('Tìm kiếm').click();

        cy.get('.accounts-table tbody tr')
            .should('be.visible');

        cy.get('.accounts-table')
            .should('be.visible')
            .and('contain', 'Phòng nghiệp vụ');

        cy.wait(1000);
    });

    // TC_046: Chọn "Phòng" và không nhập vào tên phòng cần tìm
    it('TC_046: Chọn "Phòng" và không nhập vào tên phòng cần tìm', () => {
        cy.wait(1000);

        cy.get('select[name="searchSelect"]').select(5);
        cy.get('input[name="search-input"]');
        cy.get('button').contains('Tìm kiếm').click();

        cy.contains('Thông tin tìm kiếm không hợp lệ');

        cy.wait(1000);
    });

    // TC_047: Chọn "Chức vụ" và nhập vào tên chức vụ cần tìm
    it('TC_047: Chọn "Chức vụ" và nhập vào tên chức vụ cần tìm', () => {
        cy.wait(1000);

        cy.get('select[name="searchSelect"]').select(6);
        cy.get('input[name="search-input"]').clear().type('Nhân viên');
        cy.get('button').contains('Tìm kiếm').click();

        cy.get('.accounts-table tbody tr')
            .should('be.visible');

        cy.get('.accounts-table')
            .should('be.visible')
            .and('contain', 'Nhân viên');

        cy.wait(1000);
    });

    // TC_048: Chọn "Chức vụ" và không nhập vào tên chức vụ cần tìm
    it('TC_048: Chọn "Chức vụ" và không nhập vào tên chức vụ cần tìm', () => {
        cy.wait(1000);

        cy.get('select[name="searchSelect"]').select(5);
        cy.get('input[name="search-input"]');
        cy.get('button').contains('Tìm kiếm').click();

        cy.contains('Thông tin tìm kiếm không hợp lệ');

        cy.wait(1000);
    });
})

// Success: 3
// Failed: 0