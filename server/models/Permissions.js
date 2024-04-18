module.exports = (sequelize, DataTypes) => {
    const Permission = sequelize.define("Permissions", {
        PermissionName: {
            type: DataTypes.STRING,
            charset: 'utf8mb4',
            allowNull: false,
        },
        Description: {
            type: DataTypes.STRING,
            charset: 'utf8mb4',
            allowNull: true,
        },
    }, {
        freezeTableName: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        paranoid: true,
    });

    Permission.associate = (models) => {
        Permission.hasMany(models.Role_Permissions, {
            onUpdate: 'cascade',
            onDelete: 'cascade',
        });
    };

    return Permission;
}