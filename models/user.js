const Sequelize = require("sequelize");

const sequelize = require("../util/database");
module.exports= (sequelize,Sequelize) => {
    const User = sequelize.define('newUser', {
        // // attributes
       
        firstName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,        
        },
        gender: {
            type: Sequelize.STRING,
            allowNull: false
        },
        birthdate: {
            type: Sequelize.DATEONLY,
            allowNull:false
        }
    });
return User;    
}

// module.exports =  User ;