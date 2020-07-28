const Sequelize = require("sequelize");

const sequelize = require("../util/database");

module.exports= (sequelize,Sequelize) => {
    const Blog = sequelize.define('blogdetails', {
        // // attributes   
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        publish_date: {
            type: Sequelize.DATE,
            allowNull:false
        },
        created_by: {
            type:Sequelize.STRING,
            allowNull: false
        }
    });
    return Blog;    
}

// module.exports =  User ;