module.exports = (sequelize, DataTypes) => {
    const StatusDoc = sequelize.define("StatusDoc", {
        Status: {    // Trạng thái tài liệu
            type: DataTypes.STRING(50),
            charset: 'utf8mb4',
            allowNull: true,
            defaultValue: '',
        },
    });

    StatusDoc.associate = (models) => {
        StatusDoc.hasMany(models.BooksRegisInfo, {
            foreignKey: {
                onDelete: 'cascade',
            }
        });
    };

    return StatusDoc;
}