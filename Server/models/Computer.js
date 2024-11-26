const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Image = require('./Image');

class Computer extends Model {}

Computer.init(
    {
        computer_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true, 
        },
        model: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        specification: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        manufacturer: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        releaseDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        stockCode: {
            type: DataTypes.STRING(100),
            allowNull: true,
            unique: true,
        },
        popularity: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: false,
            defaultValue: 0.00, 
        },
    },
    {
        sequelize,
        modelName: 'Computer',
        tableName: 'computers',
        timestamps: false,
    }
);

Computer.hasMany(Image, {
    foreignKey: 'computer_id',
    as: 'images',
    onDelete: 'CASCADE',
});

Image.belongsTo(Computer, {
    foreignKey: 'computer_id',
    as: 'computer',
});

module.exports = Computer;