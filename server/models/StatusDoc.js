module.exports = (sequelize, DataTypes) => {
  const StatusDoc = sequelize.define(
    "StatusDoc",
    {
      Status: {
        // Trạng thái tài liệu
        type: DataTypes.STRING(50),
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

  StatusDoc.associate = (models) => {
    StatusDoc.hasMany(models.BooksRegisInfo, {
      foreignKey: {
        onDelete: "cascade",
      },
    });
  };

  return StatusDoc;
};
