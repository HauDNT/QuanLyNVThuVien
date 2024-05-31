module.exports = (sequelize, DataTypes) => {
  const StoreTypes = sequelize.define(
    "StoreTypes",
    {
      NameType: {
        // Tên thể loại lưu trữ
        type: DataTypes.STRING(100),
        charset: "utf8mb4",
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      freezeTableName: true,
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      paranoid: true,
    },
  );

  StoreTypes.associate = (models) => {
    StoreTypes.hasMany(models.BooksRegisInfo, {
      foreignKey: {
        onDelete: "cascade",
      },
    });
  };

  return StoreTypes;
};
