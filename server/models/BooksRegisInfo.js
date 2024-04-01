module.exports = (sequelize, DataTypes) => {
    const BooksRegisInfo = sequelize.define("BooksRegisInfo", {
        RegisCode: {    // Mã đăng ký
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        DDC: {      // Mã phân loại DDC
            type: DataTypes.STRING(6),
            allowNull: false,
        },
    }, {
        freezeTableName: true,
    });

    BooksRegisInfo.associate = (models) => {
        BooksRegisInfo.belongsTo(models.Users, {
            foreignKey: {
                allowNull: false,
            }
        });
        BooksRegisInfo.belongsTo(models.Books, {
            foreignKey: {
                allowNull: false,
            }
        });
        BooksRegisInfo.belongsTo(models.Rooms, {
            foreignKey: {
                allowNull: false,
            }
        });
    };

    return BooksRegisInfo;
}