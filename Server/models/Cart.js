const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); //Import database connection
const User = require('./User');

class Cart extends Model { }

Cart.init(
    {
        cart_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        // Create foreign keys:
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
    },
    {
        sequelize,
        modelName: 'Cart',
        tableName: 'carts',
        timestamps: true,
    }
);


// 1:1 Relationship between carts and users
User.hasMany(Cart, {
    foreignKey: 'user_id',
    as: 'cart'
});

Cart.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

module.exports = Cart;