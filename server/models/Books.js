module.exports = (sequelize, DataTypes) => {
    const Books = sequelize.define("Books", {
        ISBN: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        DDC: {      // Mã phân loại DDC
            type: DataTypes.STRING(6),
            allowNull: false,
        },
        MainTitle: {    // Tiêu đề chính
            type: DataTypes.STRING(100),
            charset: 'utf8mb4',
            allowNull: false,
        },
        SubTitle: {     // Tiêu đề phụ
            type: DataTypes.STRING(100),
            charset: 'utf8mb4',
            allowNull: false,
        },
        Author: {       // Tác giả
            type: DataTypes.STRING(100),
            charset: 'utf8mb4',
            allowNull: false,
        },
        Publisher: {    // Nhà xuất bản
            type: DataTypes.STRING(100),
            charset: 'utf8mb4',
            allowNull: false,
        },
        PubPlace: {     // Nơi xuất bản
            type: DataTypes.STRING(100),
            charset: 'utf8mb4',
            allowNull: false,
        },
        PubYear: {      // Năm xuất bản
            type: DataTypes.CHAR(4),
            allowNull: false,
        },
        QuantityCopies: {   // Số bản in
            type: DataTypes.SMALLINT,
            allowNull: false,
        },
        Size: {     // Kích thước/khổ
            type: DataTypes.STRING(6),
            allowNull: false,
        },
        NumPages: {     // Số trang sách
            type: DataTypes.SMALLINT,
            allowNull: false,
        },
        UnitPrice: {    // Đơn giá
            type: DataTypes.FLOAT,
            allowNull: true,
        },
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
    };

    return Books;
}