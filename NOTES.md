--------PHẦN CLIENT---------
1. Đã cập nhật lại PORT Docker, PORT Server vào file constance.js và sử dụng nó trong các lần gọi API . Như vậy từ nay về sau chỉ cần thay đổi 1 lần trong file constance.js mà không cần thay đổi ở đâu nữa vẫn chạy ổn định.





--------PHẦN SERVER----------
1. Ta sử dụng file mysql.yml để khai báo các thông số của Database tạo trong Docker:
### mysql.yml:
    services:
    db-mysql:
        image: mysql:5.7.40
        restart: always
        environment:
        - MYSQL_DATABASE=ql_nghiepvu_thuvien
        - MYSQL_ROOT_PASSWORD=123456
        ports:
        - "3001:3306"
=> Docker sẽ sử dụng PORT 3001 để chạy Database của ứng dụng.

2. Ta thay đổi PORT của Server NodeJS thành 3002 và một số thông tin của Database để nó kết nối đúng
đến Database trong Docker:
### App NodeJS params:
    NODE_ENV = development
    PORT = 3002
    HOST_NAME = localhost
### DB's info:
    DB_HOST = localhost
    DB_USER = root
    DB_PASSWORD = 123456
    DB_NAME = ql_nghiepvu_thuvien

3. Trong file config/config.js ta thêm trường "port" là port của Database trong Docker:
module.exports = {
  "development": {
    ...
    "port": 3001, => Port ánh xạ từ Docker sang Localhost (được định nghĩa trong file mysql.yml)
  }
  ...
}

4. Đã cập nhật lại PORT Docker vào file .env và tái sử dụng nó trong file config.js và file index.js. Như vậy từ nay về sau chỉ cần thay đổi 1 lần trong file .env là có thể chạy được chương trình.

5. Tên của model được define và khi gọi khóa ngoại từ model khác phải y như nhau.
VD:
#### Model Bills:
  Bill.belongsTo(models.BillTypes, {
      foreignKey: {
          name: 'TypeOfBill',
          allowNull: false,
      }
  });

#### Model BillTypes:
module.exports = (sequelize, DataTypes) => {
    const BillTypes = sequelize.define("Bill_Types", {
        Name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    }, {
        freezeTableName: true,
        timestamps: false,
    });
}

=> Hai tên "BillTypes" & "Bill_Types" khác nhau nên sẽ gây lỗi. Ta cần lưu ý điều này!

6. Viết API xử lý tìm kiếm:
- Phương thức findAll() luôn trả về cho ta 1 mảng gồm các đối tượng dù cho chỉ có 1 kết quả.
- Cho nên khi hiển thị kết quả sau khi tìm kiếm không bị lỗi.
- Tuy nhiên, nếu sử dụng phương thức findOne() nó sẽ trả về cho ta 1 object.
- Lúc này ta phải ép kiểu cho nó thành dạng mảng (return res.json([data])) rồi mới gửi kết quả về để hiển thị ra giao diện.
- Vì search chỉ nhận và hiển thị kết quả dạng array.