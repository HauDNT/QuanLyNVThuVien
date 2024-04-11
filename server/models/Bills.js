module.exports = (sequelize, DataTypes) => {
    const Bill = sequelize.define("Bills", {
        NumberBill: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        NameBill: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        DateGenerateBill: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
        timestamps: false,
    });

    Bill.associate = (models) => {
        Bill.hasMany(models.BooksRegisInfo, {
            foreignKey: {
                allowNull: false,
            }
        });
        Bill.hasOne(models.BillToType, {
            onDelete: 'cascade',
        });
    };

    return Bill;
};