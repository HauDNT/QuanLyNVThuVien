module.exports = (sequelize, DataTypes) => {
    const Rooms = sequelize.define('Rooms', {
        RoomName: DataTypes.STRING(100),
    }, {
        freezeTableName: true,
    });

    Rooms.associate = (models) => {
        Rooms.hasMany(models.BooksRegisInfo, {
            onDelete: 'set null',
        });
        Rooms.hasOne(models.UsersInfo, {
            onDelete: 'cascade',
        });
    };

    return Rooms;
};