module.exports = (sequelize, DataTypes) => {
    const BillTypes = sequelize.define("BillTypes", {
        Name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    }, {
        freezeTableName: true,
        timestamps: false,
    });

    BillTypes.associate = (models) => {
        BillTypes.hasMany(models.Bill_Type, {
            onDelete: 'cascade',
        });
    };

    return BillTypes;
};