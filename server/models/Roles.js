module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define("Roles", {
        RoleName: {
            type: DataTypes.STRING(50),
            charset: 'utf8mb4',
            allowNull: false,
        },
        Description: {
            type: DataTypes.STRING,
            charset: 'utf8mb4',
            allowNull: true,
        }
    }, {
        freezeTableName: true,
        timestamps: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
    });

    Role.associate = (models) => {
        Role.hasMany(models.Role_Permissions, {
            onUpdate: 'cascade',
            onDelete: 'cascade',
        });
        Role.hasMany(models.User_Roles, {
            onUpdate: 'cascade',
            onDelete: 'cascade',
        });
    };

    return Role;
};