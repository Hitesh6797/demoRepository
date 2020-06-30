const path = require('path');
const express = require('express');
// const jwt =require("jsonwebtoken");
const bodyParser = require('body-parser');
const db = require('./util/database');
const app = express();
const cors = require('cors');
// const cookieParser = require('cookie-parser');

var expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
// app.use(cookieParser());
app.set( "views", path.join( __dirname, "views" ) );
// app.set( "public", path.join( __dirname, "public" ) );

// app.get('*', function(req, res, next) {
//   let err = new Error('Page Not Found');
//   res.render('pages/404');
//   err.statusCode = 404;
//   next(err);
// });
db.sequelize.sync()
.then(() => { 
    console.log("database connection established & table created!");
})
.catch(err => {
  console.log(err);
});
require("./controller/userRoutes")(app);

// app.listen(3000);
app.listen(3000,'192.168.42.80',() => console.log("server start at port : 3000"));
