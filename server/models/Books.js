module.exports = (sequelize, DataTypes) => {
  const Books = sequelize.define(
    "Books",
    {
      ISBN: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "",
      },
      DDC: {
        // Mã phân loại DDC
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "",
      },
      EncryptName: {
        // Tên mã hóa
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "",
      },
      MainTitle: {
        // Tiêu đề chính
        type: DataTypes.STRING(100),
        charset: "utf8mb4",
        allowNull: true,
        defaultValue: "",
      },
      SubTitle: {
        // Tiêu đề phụ
        type: DataTypes.STRING(300),
        charset: "utf8mb4",
        allowNull: true,
        defaultValue: "",
      },
      Types: {
        // Tiêu đề phụ
        type: DataTypes.STRING(100),
        charset: "utf8mb4",
        allowNull: true,
        defaultValue: "",
      },
      Author: {
        // Tác giả duy nhất
        type: DataTypes.STRING(200),
        charset: "utf8mb4",
        allowNull: true,
        defaultValue: "",
      },
      OrtherAuthors: {
        // Nhiều tác giả
        type: DataTypes.STRING(1000),
        charset: "utf8mb4",
        allowNull: true,
        defaultValue: "",
      },
      Editors: {
        // Phụ trách biên mục, xuất bản
        type: DataTypes.STRING(1000),
        charset: "utf8mb4",
        allowNull: true,
        defaultValue: "",
      },
      Synopsis: {
        // Tóm tắt nội dung
        type: DataTypes.STRING(1000),
        charset: "utf8mb4",
        allowNull: true,
        defaultValue: "",
      },
      Topic: {
        // Chủ đề
        type: DataTypes.STRING(100),
        charset: "utf8mb4",
        allowNull: true,
        defaultValue: "",
      },
      Publisher: {
        // Nhà xuất bản
        type: DataTypes.STRING(100),
        charset: "utf8mb4",
        allowNull: true,
        defaultValue: "",
      },
      PubPlace: {
        // Nơi xuất bản
        type: DataTypes.STRING(100),
        charset: "utf8mb4",
        allowNull: true,
        defaultValue: "",
      },
      PubYear: {
        // Năm xuất bản
        type: DataTypes.CHAR(4),
        allowNull: true,
        defaultValue: "",
      },
      QuantityCopies: {
        // Số bản in
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      Size: {
        // Kích thước/khổ
        type: DataTypes.STRING(6),
        allowNull: true,
        defaultValue: "",
      },
      NumPages: {
        // Số trang sách
        type: DataTypes.SMALLINT,
        allowNull: true,
        defaultValue: 0,
      },
      UnitPrice: {
        // Đơn giá
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
      },
    },
    {
      freezeTableName: true,
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      paranoid: true,
    },
  );

  Books.associate = (models) => {
    Books.hasMany(models.BooksRegisInfo, {
      onDelete: "cascade",
    });
    Books.belongsTo(models.Users, {
      onDelete: "cascade",
    });
  };

  return Books;
};
