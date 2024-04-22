module.exports = (sequelize, DataTypes) => {
    const BooksRegisInfo = sequelize.define("BooksRegisInfo", {
        RegisCode: {    // Mã đăng ký: PM23.055678, VL.0853, VV.056312
            type: DataTypes.STRING(20),
            allowNull: true,
            defaultValue: '',
        },
        Status: {       // Duyệt/Chưa duyệt
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        IndiRegis: {    // Đã được ĐKCB chưa?
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
    }, {
        freezeTableName: true,
        paranoid: true,
    });

    BooksRegisInfo.associate = (models) => {
        BooksRegisInfo.belongsTo(models.Users, {
            foreignKey: {
                name: 'UserId',
            }
        });
        BooksRegisInfo.belongsTo(models.Books, {
            foreignKey: {
                name: 'BookId',
            }
        });
        BooksRegisInfo.belongsTo(models.Rooms, {
            foreignKey: {
                name: 'RoomId',
            }
        });
        BooksRegisInfo.belongsTo(models.Bills, {
            foreignKey: {
                name: 'Bill_Id',
            }
        });
    };

    return BooksRegisInfo;
}