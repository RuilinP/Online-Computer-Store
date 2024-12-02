const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Image extends Model {}

Image.init(
    {
        image_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        image_path: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Image',
        tableName: 'images',
        timestamps: false,
    }
);

module.exports = Image;
