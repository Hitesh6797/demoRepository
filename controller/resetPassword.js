const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const db = require("../util/database");
const { Op } = require('sequelize');
const Admin = db.admin;
require('dotenv').config();

const transporter = nodemailer.createTransport(
    sendgridTransport({
      auth: {
        api_key: process.env.api_key
    }
    })
  );

exports.postReset = async (req, res, next) => {
    let statusCode = 400; 
    let responseData = {};
    var user = await Admin.findOne({
        attributes: ["id", "email"],
        where: { email: req.body.email },
    });
    console.log(user);
    if(user === null) {
        statusCode = 404;
        responseData = {
            errorMessage:{
                email:{msg:'user not found with this mail!'}
            }
        };       
    } else {
        let token = crypto.randomBytes(64).toString('hex');
        expireTime = Date.now() + 3600000;
        await Admin.update({ 
            resetPasswordToken: token,
            resetPasswordExpires: expireTime
        }, { where: { email: req.body.email } })

        transporter.sendMail({ 
            to: req.body.email,
            from: process.env.fromMail,
            subject: 'Password reset',
            html: `
            <p>You requested for reset password</p>
            <p>Click this <a href="http://192.168.42.80:3000/reset-password/${token}">link</a> to set a new password.</p>
            `
        });

        statusCode = 200;
        responseData = {
            user:user
        }
    }
    return res.status(statusCode).send(responseData).end();
};
  
exports.getNewPassword = async (req, res, next) => {
    const token = req.params.token;
    let statusCode = 200;
    let responseData = {};
    let user = await Admin.findOne({
        attributes: ["id", "resetPasswordToken"],
        where:{ resetPasswordToken: token, resetPasswordExpires:{ [Op.gte]: new Date() } }
    })
    if(user) {
        res.render('pages/new-password',{
            userId:user.id,
            passwordToken:user.resetPasswordToken           
        });
    } else {
        res.render('pages/404')
    }
};

exports.postNewPassword = async (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
  
    await Admin.findOne({
        resetPasswordToken: passwordToken,
        resetPasswordExpires: { [Op.gte]: new Date() },
        id: userId
    })
    .then(user => {
        resetUser = user;
        return bcrypt.hash(newPassword, 10);
    })
    .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetPasswordToken = null;
        resetUser.resetPasswordExpires = null;
        // console.log(resetUser);
        return resetUser.save();
    })
    .then(result => {
        res.redirect('/');
        })
        .catch(err => {
        console.log(err);
    });
  };
  