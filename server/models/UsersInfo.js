module.exports = (sequelize, DataTypes) => {
    const UsersInfo = sequelize.define("UsersInfo", {
        Fullname: {     
            type: DataTypes.STRING,
            charset: 'utf8mb4',
            allowNull: false,
        },
        Birthday: {     
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Position: {     // Chức vụ (Trưởng phòng, nhân viên,...)
            type: DataTypes.STRING,
            charset: 'utf8mb4',
            allowNull: false,
        },
        Avatar: {
            type: DataTypes.BLOB('medium'),
            allowNull: false,
        },
    }, {
        freezeTableName: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
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
    };

    return UsersInfo;
}