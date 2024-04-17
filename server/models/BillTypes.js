module.exports = (sequelize, DataTypes) => {
    const BillTypes = sequelize.define("BillTypes", {
        Name: {
            type: DataTypes.STRING(50),
            charset: 'utf8mb4',
            allowNull: false,
        },
    }, {
        freezeTableName: true,
        timestamps: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
    });

    BillTypes.associate = (models) => {
        BillTypes.hasMany(models.BillToType, {
            onDelete: 'cascade',
        });
    };

    return BillTypes;
};