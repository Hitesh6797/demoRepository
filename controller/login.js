const bcrypt = require('bcryptjs');
const db = require("../util/database");
const Admin = db.admin;
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { validationResult } = require('express-validator');

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    var localStorage = new LocalStorage('./scratch');
}
let statusCode = 401
let responseData = {};
// Login using admin and generate JWT token
exports.login = async (req, res) => {
    let errors = validationResult(req);
    console.log(errors.mapped());
    if(!errors.isEmpty()) {
        statusCode = 422
        responseData = {
            errorMessage: errors.mapped()
        };
    } else {
        try {
            let user = await Admin.findOne({
                attributes: ["id", "email","password"],
                where: { email: req.body.email },
            }).then(user => {return user}).catch(err => {throw err})
            if(user === null) {
                statusCode = 404;
                responseData = {
                    errorMessage:{
                        email:{msg:'user not found with this mail!'}
                    }
                };        
            } else {
                const result = await bcrypt.compare(req.body.password, user.password)
                if(result === true){
                    const accessToken = jwt.sign(
                        { username: req.body.email },
                        process.env.accessTokenSecret,
                        { expiresIn: '1h' },
                    );
                    localStorage.setItem('token',accessToken);
                    statusCode = 200;
                    responseData = {
                        code: statusCode,
                        data: 'email and password match!'
                    }   
                } else {
                    statusCode = 401;
                    responseData = {
                        errorMessage:{
                            password:{msg:'password not match with this mail'}
                        }
                    };        
                }
            }
        } catch (err) {
            statusCode = 500;
            responseData = {err:err};       
        }    
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

