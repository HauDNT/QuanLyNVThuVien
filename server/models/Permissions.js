module.exports = (sequelize, DataTypes) => {
    const Permission = sequelize.define("Permissions", {
        PermissionName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        freezeTableName: true,
        timestamps: false,
    });

    Permission.associate = (models) => {
        Permission.hasMany(models.Role_Permissions, {
            onUpdate: 'cascade',
            onDelete: 'cascade',
        });
    };

    return Permission;
}