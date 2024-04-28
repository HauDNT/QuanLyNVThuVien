module.exports = (sequelize, DataTypes) => {
    const EncryptTitle = sequelize.define("EncryptTitles", {
        Character: {
            type: DataTypes.STRING(50),
            charset: 'utf8mb4',
            allowNull: false,
            defaultValue: '',
        },
        NumberEncrypt: {
            type: DataTypes.STRING(10),
            charset: 'utf8mb4',
            allowNull: true,
            defaultValue: '',
        }
    });

    return EncryptTitle;
};