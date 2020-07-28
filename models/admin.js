const Sequelize = require("sequelize");

const sequelize = require("../util/database");

module.exports= (sequelize,Sequelize) => {
    const Admin = sequelize.define('admindetails', {
        // // attributes   
        email: {
            type: Sequelize.STRING,
            require: true,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        resetPasswordToken: {
            type: Sequelize.STRING,
            allowNull:true
        },
        resetPasswordExpires: {
            type:Sequelize.DATE,
            allowNull: true
        }
    });
    return Admin;    
}

// module.exports =  User ;