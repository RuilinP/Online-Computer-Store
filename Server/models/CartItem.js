const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); //Import database connection
const Cart = require('./Cart');
const Computer = require('./Computer');

class CartItem extends Model { }

CartItem.init(
    {
        cart_item_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        // Create foreign keys:
        cart_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Cart,
                key: 'cart_id',
            },
        },
        computer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Computer,
                key: 'computer_id',
            },
        },

        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            },
        },
    },
    {
        sequelize,
        modelName: 'CartItem',
        tableName: 'cart_items',
        timestamps: true,
    }
);


// 1:M Relationship between CartItem: Computer and Order
Cart.hasMany(CartItem, {
    foreignKey: 'cart_id',
    as: 'items'
});

CartItem.belongsTo(Cart, {
    foreignKey: 'cart_id',
    as: 'cart'
});
Computer.hasMany(CartItem, {
    foreignKey: 'computer_id',
    as: 'cartItems'
});

CartItem.belongsTo(Computer, {
    foreignKey: 'computer_id',
    as: 'computer'
});

module.exports = CartItem;