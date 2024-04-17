module.exports = (sequelize, DataTypes) => {
    const BooksRegisInfo = sequelize.define("BooksRegisInfo", {
        RegisCode: {    // Mã đăng ký
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        Status: {      // Duyệt/Chưa duyệt
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        IndiRegis: {    // Đã được ĐKCB chưa?
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
    }, {
        freezeTableName: true,
    });

    BooksRegisInfo.associate = (models) => {
        BooksRegisInfo.belongsTo(models.Users, {
            foreignKey: {
                name: 'UserId',
                allowNull: false,
            }
        });
        BooksRegisInfo.belongsTo(models.Books, {
            foreignKey: {
                name: 'BookId',
                allowNull: false,
            }
        });
        BooksRegisInfo.belongsTo(models.Rooms, {
            foreignKey: {
                name: 'RoomId',
                allowNull: false,
            }
        });
        BooksRegisInfo.belongsTo(models.Bills, {
            foreignKey: {
                name: 'Bill_Id',
                allowNull: false,
            }
        });
    };

    return BooksRegisInfo;
}