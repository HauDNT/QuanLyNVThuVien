module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "Users",
    {
      Username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    },
  );

  Users.associate = (models) => {
    Users.hasOne(models.UsersInfo, {
      onDelete: "cascade",
    });
    Users.hasMany(models.BooksRegisInfo, {
      onDelete: "cascade",
    });
    Users.hasMany(models.Books, {
      onDelete: "cascade",
    });
    Users.hasOne(models.User_Roles, {
      onDelete: "cascade",
    });
  };

  return Users;
};
