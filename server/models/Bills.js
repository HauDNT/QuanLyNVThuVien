module.exports = (sequelize, DataTypes) => {
  const Bill = sequelize.define(
    "Bills",
    {
      NameBill: {
        type: DataTypes.STRING(100),
        charset: "utf8mb4",
        allowNull: false,
        defaultValue: "",
      },
      DateGenerateBill: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      Supplier: {
        type: DataTypes.STRING(100),
        charset: "utf8mb4",
        allowNull: false,
        defaultValue: "",
      },
      Discount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      Notes: {
        type: DataTypes.TEXT("medium"),
        charset: "utf8mb4",
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      paranoid: true,
    },
  );

  Bill.associate = (models) => {
    Bill.hasMany(models.BooksRegisInfo, {
      foreignKey: {
        onDelete: "cascade",
      },
    });
    Bill.belongsTo(models.BillTypes, {
      onDelete: "cascade",
    });
  };

  return Bill;
};
