const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./util/database');
const app = express();
const cors = require('cors');

require('dotenv').config();

var expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.set( "views", path.join( __dirname, "views" ) );

db.sequelize.sync()
.then(() => { 
    console.log("database connection established & table created!");
})
.catch(err => {
  console.log(err);
});
require("./route/userRoutes")(app);

app.listen(process.env.PORT,'192.168.42.80',() => console.log("server start at port : 3000"));
