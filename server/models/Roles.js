module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Roles",
    {
      RoleName: {
        type: DataTypes.STRING(50),
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

  Role.associate = (models) => {
    Role.hasMany(models.User_Roles, {
      onUpdate: "cascade",
      onDelete: "cascade",
    });
  };

  return Role;
};
