const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); //Import database connection
const User = require('./User');

class Order extends Model { }

Order.init(
    {
        order_id: {
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
        total_price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        order_status: { //Pendding, completed or canceled
            type: DataTypes.ENUM('pending', 'completed', 'canceled'),
            allowNull: false,
            defaultValue: 'pendding',
        }
    },
    {
        sequelize,
        modelName: 'Order',
        tableName: 'orders',
        timestamps: true,
    }
);


//Relationship between orders and users
User.hasMany(Order, {
    foreignKey: 'user_id',
    as: 'orders'
});

Order.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

module.exports = Order;