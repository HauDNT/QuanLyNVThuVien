module.exports = (sequelize, DataTypes) => {
    const UsersInfo = sequelize.define("UsersInfo", {
        Fullname: {     
            type: DataTypes.STRING,
            charset: 'utf8mb4',
            allowNull: false,
        },
        Birthday: {     
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        PhoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
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