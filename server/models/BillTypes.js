module.exports = (sequelize, DataTypes) => {
    const BillTypes = sequelize.define("BillTypes", {
        Name: {
            type: DataTypes.STRING(50),
            charset: 'utf8mb4',
            allowNull: false,
            defaultValue: '',
        },
    }, {
        freezeTableName: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        paranoid: true,
    });

    BillTypes.associate = (models) => {
        BillTypes.hasMany(models.Bills, {
            onDelete: 'SET DEFAULT',
        });
    };

    return BillTypes;
};