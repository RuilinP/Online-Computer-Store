//Hooks refrence: https://sequelize.org/docs/v6/other-topics/hooks/

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); //Import database connection
const bcrypt = require('bcrypt');

// function helping with hash the password
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};


class User extends Model { }

User.init(
    {
        //Model attribuites
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'name is required'
                },
            },
        },

        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'Phone already in use',
            },
            validate: {
                isNumeric: {
                    msg: 'Phone number must be only numbers',
                },
                len: {
                    args: [10, 12],
                    msg: 'Phone number can contain 10-12 numbers only',
                },
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'Email already in use',
            },
            validate: {
                isEmail: {
                    msg: 'Enter a valid email address please!',
                },
            }
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Address is required',
                },
            },
        },
        password: {
            type: DataTypes.VIRTUAL, // Virtual field (not stored in the database)
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Password is required',
                },
                is: {
                    args: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,60}$/,
                    msg: 'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.',
                },
            },
        },
        hashedPassword: {
            type: DataTypes.STRING(64),
            allowNull: true,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'buyer',
            validate: {
                isIn: {
                    args: [['admin', 'buyer']],
                    msg: 'Role must be admin or buyer',
                },
            },
        },
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
        paranoid: true,
    },
);


User.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.hashedPassword);
};

// This hook to hash the password before creating a new user
User.beforeCreate(async (user, options) => {

    if (user.password) {
        user.hashedPassword = await hashPassword(user.password);
    } else {
        throw new Error('Password is required to create a user.');
    }
});

User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
        user.hashedPassword = await hashPassword(user.password);
    }
});

module.exports = User;


