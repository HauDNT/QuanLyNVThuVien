module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define("Roles", {
        RoleName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        Description: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        freezeTableName: true,
        timestamps: false,
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