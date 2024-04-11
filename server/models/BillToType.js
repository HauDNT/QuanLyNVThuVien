module.exports = (sequelize, DataTypes) => {
    const BillToType = sequelize.define("BillToType", {}, {
        freezeTableName: true,
        timestamps: false,
    }); 

    BillToType.associate = (models) => {
        BillToType.belongsTo(models.Bills, {
            foreignKey: {
                allowNull: false,
            }
        });
        BillToType.belongsTo(models.BillTypes, {
            foreignKey: {
                allowNull: false,
            }
        });
    };

    return BillToType;
};