module.exports = (sequelize, DataTypes) => {
    const Rooms = sequelize.define('Rooms', {
        RoomName: {
            type: DataTypes.STRING(100),
            charset: 'utf8mb4',
            allowNull: false,
            defaultValue: '',
        }
    }, {
        freezeTableName: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        paranoid: true,
    });

    Rooms.associate = (models) => {
        Rooms.hasMany(models.BooksRegisInfo, {
            onDelete: 'cascade',
        });
        Rooms.hasOne(models.UsersInfo, {
            onDelete: 'cascade',
        });
    };

    return Rooms;
};