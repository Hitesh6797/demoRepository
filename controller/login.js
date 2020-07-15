const jwt = require("jsonwebtoken");
require('dotenv').config();

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    var localStorage = new LocalStorage('./scratch');
}

// Login using admin and generate JWT token
exports.login = (req, res) => {
    try {
        if (req.body.email == "admin@argon.com" && req.body.password == "secret") {
            // Generate an access token
            const accessToken = jwt.sign(
                { username: req.body.email },
                process.env.accessTokenSecret,
                { expiresIn: '1h' },
            );
            localStorage.setItem('token',accessToken);
            res.status(200).send({
                "code":200,
                "x-access-token": accessToken,
              });
        } else if(req.body.email == "admin@argon.com" && req.body.password != "secret"){
            res.send({
                code:401,
                message:"Invalid password!!"
            });
            res.end();
        } else if(req.body.email != "admin@argon.com" && req.body.password == "secret"){
            res.send({
                code:401,
                message:"Invalid Username!!"
            });
            res.end();
        } else {
            res.send({
                "code":401,
                "message":"Username and password are incorrect!!"
            }); 
        }
    } catch (err) {
        res.status(500).send({error:err})        
    }
};


exports.checkLogin = (req,res,next) => {
    var token = localStorage.getItem('token');
    try {
        jwt.verify(token,process.env.accessTokenSecret,(err) => {
            if(err) {
                res.render('pages/403')
                // console.log(err); 
            } else {
                next();
            }
        });
    } catch (err) {
        console.log(err);   
    }
}

