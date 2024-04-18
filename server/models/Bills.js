module.exports = (sequelize, DataTypes) => {
    const Bill = sequelize.define("Bills", {
        NumberBill: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        NameBill: {
            type: DataTypes.STRING(100),
            charset: 'utf8mb4',
            allowNull: false,
        },
        DateGenerateBill: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        Supplier: {
            type: DataTypes.STRING(100),
            charset: 'utf8mb4',
            allowNull: false,
        },
        Discount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Notes: {
            type: DataTypes.TEXT('medium'),
            charset: 'utf8mb4',
            allowNull: false,
        },
    }, {
        freezeTableName: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        paranoid: true,
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