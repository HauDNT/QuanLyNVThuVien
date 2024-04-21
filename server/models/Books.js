module.exports = (sequelize, DataTypes) => {
    const Books = sequelize.define("Books", {
        ISBN: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        DDC: {      // Mã phân loại DDC
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        EncryptName: {      // Tên mã hóa
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        MainTitle: {    // Tiêu đề chính
            type: DataTypes.STRING(100),
            charset: 'utf8mb4',
            allowNull: true,
        },
        SubTitle: {     // Tiêu đề phụ
            type: DataTypes.STRING(300),
            charset: 'utf8mb4',
            allowNull: true,
        },
        Types: {        // Tiêu đề phụ
            type: DataTypes.STRING(100),
            charset: 'utf8mb4',
            allowNull: true,
        },
        Author: {       // Tác giả duy nhất
            type: DataTypes.STRING(100),
            charset: 'utf8mb4',
            allowNull: true,
        },
        OrtherAuthors: { // Nhiều tác giả
            type: DataTypes.STRING(1000),
            charset: 'utf8mb4',
            allowNull: true,
        },
        Editors: { // Nhiều tác giả
            type: DataTypes.STRING(1000),
            charset: 'utf8mb4',
            allowNull: true,
        },
        Synopsis: {     // Tóm tắt nội dung
            type: DataTypes.STRING(1000),
            charset: 'utf8mb4',
            allowNull: true,
        },
        Topic: {       // Chủ đề
            type: DataTypes.STRING(100),
            charset: 'utf8mb4',
            allowNull: true,
        },
        Publisher: {    // Nhà xuất bản
            type: DataTypes.STRING(100),
            charset: 'utf8mb4',
            allowNull: true,
        },
        PubPlace: {     // Nơi xuất bản
            type: DataTypes.STRING(100),
            charset: 'utf8mb4',
            allowNull: true,
        },
        PubYear: {      // Năm xuất bản
            type: DataTypes.CHAR(4),
            allowNull: true,
        },
        QuantityCopies: {   // Số bản in
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        Size: {         // Kích thước/khổ
            type: DataTypes.STRING(6),
            allowNull: true,
        },
        NumPages: {     // Số trang sách
            type: DataTypes.SMALLINT,
            allowNull: true,
        },
        UnitPrice: {    // Đơn giá
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        Status: {       // Duyệt/Chưa duyệt
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    }, {
        freezeTableName: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        paranoid: true,
    });

    Books.associate = (models) => {
        Books.hasMany(models.BooksRegisInfo, {
            onDelete: 'cascade',
        });
        Books.hasMany(models.Users, {
            onDelete: 'cascade',
        });
    };

    return Books;
}