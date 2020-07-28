const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.MY_DB,process.env.ROOT,process.env.PASSWORD,{
    dialect: process.env.DATABASE,
    host: process.env.HOST,
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
db.admin = require('../models/admin')(sequelize,Sequelize);
db.blog = require('../models/blog')(sequelize,Sequelize);
module.exports = db;

// module.exports = sequelize;