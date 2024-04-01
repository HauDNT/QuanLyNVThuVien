module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        Username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        freezeTableName: true
    });

    Users.associate = (models) => {
        Users.hasOne(models.UsersInfo, {
            onDelete: 'cascade',
        });
        Users.hasMany(models.BooksRegisInfo, {
            onDelete: 'cascade',
        });
    };

    return Users;
}