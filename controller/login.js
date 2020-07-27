const jwt = require("jsonwebtoken");
require('dotenv').config();
const { validationResult } = require('express-validator');

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    var localStorage = new LocalStorage('./scratch');
}

// Login using admin and generate JWT token
exports.login = (req, res) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({
            errorMessage: errors.mapped()
        });
    }
    let statusCode = 401
    let responseData = {};
    try {
        if (req.body.email == "admin@argon.com" && req.body.password == "secret") {
            // Generate an access token
            const accessToken = jwt.sign(
                { username: req.body.email },
                process.env.accessTokenSecret,
                { expiresIn: '1h' },
            );
            localStorage.setItem('token',accessToken);
            statusCode = 200;
            responseData = {
                "code":200,
                "x-access-token": accessToken,
              };
        } else if(req.body.email == "admin@argon.com" && req.body.password != "secret"){
            responseData = {
                errorMessage:{
                    password:{
                        value: req.body.password,
                        msg: 'Password is incorrect!'
                    }
                }
            };
        } else if(req.body.email != "admin@argon.com" && req.body.password == "secret"){
            responseData = {
                errorMessage:{
                    email:{
                        value: req.body.email,
                        msg: 'Invalid email address!'
                    }
                }
            };
        } else {
            responseData = {
                errorMessage:{
                    password:{
                        value: req.body.password,
                        msg: 'Invalid password!'
                    },
                    email:{
                        value: req.body.email,
                        msg: 'Invalid email address!'
                    }
                }
            }; 
        }
    } catch (err) {
        statusCode = 500;
        responseData = {err:err};       
    }
    return res.status(statusCode).send(responseData).end();
};

exports.checkLogin = (req,res,next) => {
    let token = localStorage.getItem('token');
    try {
        jwt.verify(token,process.env.accessTokenSecret,(err) => {
            if(err) {
                res.render('pages/403')
            } else {
                next();
            }
        });
    } catch (err) {
        console.log(err);   
    }
}