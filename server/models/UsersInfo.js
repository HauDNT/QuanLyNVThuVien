module.exports = (sequelize, DataTypes) => {
    const UsersInfo = sequelize.define("UsersInfo", {
        Fullname: {     
            type: DataTypes.STRING,
            charset: 'utf8mb4',
            allowNull: false,
            defaultValue: '',
        },
        Birthday: {     
            type: DataTypes.DATEONLY,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        Email: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: '',
        },
        PhoneNumber: {
            type: DataTypes.STRING(20),
            allowNull: true,
            defaultValue: '',
        },
        Avatar: {
            type: DataTypes.BLOB('medium'),
            allowNull: true,
        },
    }, {
        freezeTableName: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        paranoid: true,
    });

    UsersInfo.associate = (models) => {
        UsersInfo.belongsTo(models.Users, {
            foreignKey: {
                allowNull: false,
            }
        });
        UsersInfo.belongsTo(models.Rooms, {
            foreignKey: {
                allowNull: false,
            }
        });
        UsersInfo.belongsTo(models.Positions, {
            foreignKey: {
                allowNull: false,
            }
        });
    };

    return UsersInfo;
}