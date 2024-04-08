module.exports = (sequelize, DataTypes) => {
    const BillToType = sequelize.define("Bill_Type", {}, {
        freezeTableName: true,
        timestamps: false,
    }); 

    BillToType.associate = (models) => {
        BillToType.belongsTo(models.Bills, {
            foreignKey: {
                name: 'BillId',
                allowNull: false,
            }
        });
        BillToType.belongsTo(models.BillTypes, {
            foreignKey: {
                name: 'TypeId',
                allowNull: false,
            }
        });
    };

    return BillToType;
};