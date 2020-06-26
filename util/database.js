const Sequelize = require('sequelize');
const config = require('../env/config');
const sequelize = new Sequelize(config.DB,config.root,config.password,{
    dialect: config.DATABASE,
    host: config.HOST,
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
const db = {};
 
db.Sequelize = Sequelize;
db.sequelize = sequelize;
 
//Models/tables
db.users = require('../models/user')(sequelize, Sequelize);
 
module.exports = db;

// module.exports = sequelize;