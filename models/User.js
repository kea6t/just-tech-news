const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// Create our User Model
class User extends Model {}

    // Define table columns and configuration
    User.init(
    {
        // Define an id column
        id: {
            // Use the special Sequelize DataTypes object to provide what type of data it is
            type: DataTypes.INTEGER,
            // this is the equivalent of SQL's `NOT NULL` option
            allowNull: false,
            // instruct that this is the primary key
            primaryKey: true,
            // turn on auto increment
            autoIncrement: true
        },
        // Define username column
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // there cannot be any duplicate email values in this Table
            unique: true,
            // if allowNull is set to false, we can run our data through validator's before creating the table data
            validate: {
                isEmail: true
            }
        },
        // define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // this means the password must be at least four characters long
                len: [4]
            }
        }
    },
    {
        // Table configuration options go here(https://sequelize.org/v5/manual/models-definition.html#configuration))

        // pass in our imported sequelize connection (the direct connection to our database) 
        sequelize,
        // Don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,
        // Don't pluralize name of database table
        freezeTableName: true,
        // Use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
        underscored: true,
        // Make it so our model name stays lowercase in the database
        modelName: 'user'

    }
);

module.exports = User;