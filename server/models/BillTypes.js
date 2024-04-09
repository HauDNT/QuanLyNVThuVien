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
        BillTypes.hasMany(models.BillToType, {
            onDelete: 'cascade',
        });
    };

    return BillTypes;
};