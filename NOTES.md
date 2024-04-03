--------PHẦN CLIENT---------






--------PHẦN SERVER----------
1. Ta sử dụng file mysql.yml để khai báo các thông số của Database tạo trong Docker:
# mysql.yml:
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
# App NodeJS params:
    NODE_ENV = development
    PORT = 3002
    HOST_NAME = localhost
# DB's info:
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