describe('ACCEPTANT TEST - Kiểm thử giao diện và trải nghiệm người dùng | Test case: AT005 - AT010', () => {
    // Truy cập vào trang đăng nhập trước khi test
    beforeEach(() => {
        cy.visit('http://localhost:3000/login')
    })

    // AT_005: Giao diện form hiển thị đầy đủ các thành phần cần thiết
    it('AT_005: Giao diện form hiển thị đầy đủ các thành phần cần thiết', () => {
        cy.get('h3.title').should('contain', 'Quản trị thư viện - LibTech');
        cy.get('input[name="username"]').should('be.visible');
        cy.get('input[name="password"]').should('be.visible');
        cy.get('button[type="submit"]').should('contain', 'Đăng nhập');

        cy.wait(1000);
    });

    // AT_006: Kiểm tra nút "Đăng nhập" khi nhập dữ liệu đầy đủ
    it('AT_006: Kiểm tra nút "Đăng nhập" khi nhập dữ liệu đầy đủ', () => {
        cy.get('input[name="username"]').type('admin');
        cy.get('input[name="password"]').type('12345678');
        cy.get('button[type="submit"]').should('be.enabled');
        cy.get('button[type="submit"]').click();

        cy.contains("LIBTECH").should('be.visible');
        cy.wait(1000);
    });

    // AT_007 - 1: Kiểm tra tính năng ẩn mật khẩu
    it('AT_007_1: Kiểm tra tính năng ẩn mật khẩu', () => {
        cy.get('input[name="password"]').type('12345678'); // Nhập mật khẩu
        cy.get('input[name="password"]').should('have.attr', 'type', 'password'); // Mật khẩu được ẩn
    });

    // AT_007 - 2: Kiểm tra tính năng hiển thị mật khẩu
    it('AT_007_2: Kiểm tra tính năng hiển thị mật khẩu', () => {
        cy.get('input[name="password"]').type('12345678'); // Nhập mật khẩu
        cy.get('input[name="password"]').should('have.attr', 'type', 'text'); // Mật khẩu được hiển thị
    });

    // AT_008: Kiểm tra thông báo nếu đăng nhập không thành công
    it('AT_008: Kiểm tra thông báo nếu đăng nhập không thành công', () => {
        cy.get('input[name="username"]').type('user_not_exist'); // Nhập thông tin không tồn tại
        cy.get('input[name="password"]').type('wrong_password'); // Nhập mật khẩu không đúng
        cy.get('button[type="submit"]').click(); // Thực hiện đăng nhập
        cy.contains('Tài khoản không tồn tại. Vui lòng kiểm tra và thử lại').should('be.visible'); // Kiểm tra thông báo
    });

    // AT_009: Kiểm tra các thông báo tại các text field khi dữ liệu không đầy đủ
    it('AT_009: Kiểm tra các thông báo tại các text field khi dữ liệu không đầy đủ', () => {
        cy.get('input[name="username"]').clear();
        cy.get('input[name="password"]').clear();
        cy.get('button[type="submit"]').click();
        cy.contains('Bạn phải nhập vào tên tài khoản!').should('be.visible');
        cy.contains('Bạn phải nhập vào mật khẩu!').should('be.visible');
    });

    // AT_013: Tốc độ xử lý đăng nhập.
    it('AT_013: Tốc độ xử lý đăng nhập.', () => {
        const startTime = Date.now(); // Lấy thời gian bắt đầu

        cy.request({
            method: 'POST',
            url: 'http://localhost:3002/users/login',
        }).then((response) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            cy.log(`Tốc độ phản hồi: ${responseTime} ms`);
            expect(responseTime).to.be.lessThan(3000);
        });
    });

    // AT_019: Cập nhật thành công với thông tin hợp lệ.
    it('AT_019: Cập nhật thành công với thông tin hợp lệ.', () => {
        // Đăng nhập vào lại
        cy.get('input[name="username"]').type('admin');
        cy.get('input[name="password"]').type('12345678');
        cy.get('button[type="submit"]').click();
        cy.wait(2000);

        cy.visit('http://localhost:3000/users/edit/1');
        cy.wait(1000);

        cy.get('input[name="NewPassword"]').clear().type('12345678');
        cy.get('select[name="RoleId"]').select(1);
        cy.get('select[name="PositionId"]').select(1);
        cy.get('select[name="RoomId"]').select(1);
        cy.get('input[name="Fullname"]').clear().type('Tiền Hậu');
        cy.get('input[name="Email"]').clear().type('tienhau@gmail.com');
        cy.get('input[name="PhoneNumber"]').clear().type('0941222449');
        cy.get('input[name="Birthday"]')
            .clear()
            .type('2003-01-18')
            .should('have.value', '2003-01-18');

        cy.get('button[type="submit"]').click();
        cy.contains('Đã cập nhật thông tin thành công');
        cy.wait(1000);
    });
});

// Success: 6
// Failed: 2