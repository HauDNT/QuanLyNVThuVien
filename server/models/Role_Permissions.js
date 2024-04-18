module.exports = (sequelize, DataTypes) => {
    const RolePer = sequelize.define("Role_Permissions", {
    }, {
        freezeTableName: true,
        paranoid: true,
    });

    RolePer.associate = (models) => {
        RolePer.belongsTo(models.Roles, {
            foreignKey: {
                name: 'RoleId',
                allowNull: false,
            }
        });
        RolePer.belongsTo(models.Permissions, {
            foreignKey: {
                name: 'PermissionId',
                allowNull: false,
            }
        });
    };

    return RolePer;
}