module.exports = (sequelize, DataTypes) => {
  const Positions = sequelize.define(
    "Positions",
    {
      PositionName: {
        type: DataTypes.STRING(100),
        charset: "utf8mb4",
        allowNull: false,
        defaultValue: "",
      },
      Description: {
        type: DataTypes.STRING,
        charset: "utf8mb4",
        allowNull: true,
        defaultValue: "",
      },
    },
    {
      freezeTableName: true,
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      paranoid: true,
    },
  );

  Positions.associate = (models) => {
    Positions.hasMany(models.UsersInfo, {
      onUpdate: "cascade",
      onDelete: "cascade",
    });
  };

  return Positions;
};
