const jwt = require("jsonwebtoken");
require('dotenv').config();
const { validationResult } = require('express-validator');

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    var localStorage = new LocalStorage('./scratch');
}

// Login using admin and generate JWT token
exports.login = (req, res) => {
    const errors = validationResult(req);
    console.log(errors.mapped());
    if(!errors.isEmpty()) {
        return res.status(422).json({
            errorMessage: errors.mapped()
        });
    }
    try {
        console.log(req.body);
        if (req.body.email == "admin@argon.com" && req.body.password == "secret") {
            // Generate an access token
            const accessToken = jwt.sign(
                { username: req.body.email },
                process.env.accessTokenSecret,
                { expiresIn: '1h' },
            );
            localStorage.setItem('token',accessToken);
            return res.status(200).send({
                "code":200,
                "x-access-token": accessToken,
              });
        } else if(req.body.email == "admin@argon.com" && req.body.password != "secret"){
            return res.status(401).send({
                errorMessage:{
                    password:{
                        value: req.body.password,
                        msg: 'Password is incorrect!'
                    }
                }
            });
            res.end();
        } else if(req.body.email != "admin@argon.com" && req.body.password == "secret"){
            return res.status(401).send({
                errorMessage:{
                    email:{
                        value: req.body.email,
                        msg: 'Invalid email address!'
                    }
                }
            });
        } else {
            res.status(401).send({
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

