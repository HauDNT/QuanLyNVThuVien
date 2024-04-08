module.exports = (sequelize, DataTypes) => {
    const UserRole = sequelize.define("User_Roles", {
    }, {
        timestamps: false,
    });

    UserRole.associate = (models) => {
        UserRole.belongsTo(models.Roles, {
            foreignKey: {
                name: 'RoleId',
                allowNull: false,
            }
        });
        UserRole.belongsTo(models.Users, {
            foreignKey: {
                name: 'UserId',
                allowNull: false,
            }
        });
    };

    return UserRole;
}