const db = require("../util/database");
const User = db.users;
const { check,validationResult, matchedData } = require('express-validator');
const fs = require('fs');

// POST User details to database
exports.create = async (req,res) => {    
    let statusCode = 422;
    let responseData = {};
    // console.log(req.body,req.files);
    
    let errors = validationResult(req);
    console.log(errors.mapped());
    
    if(!errors.isEmpty()) {
        responseData = {
            errorMessage: errors.mapped()
        };
    } else {
        let profile = req.files.profile_photo;
        // console.log(profile.name);
        if(profile.mimetype === 'image/jpeg' || profile.mimetype === 'image/jpg' || profile.mimetype === 'image/png') {
            profile.mv('./public/img/theme/' + profile.name);
    
            await User.create({
                firstName: req.body.fname,
                lastName: req.body.lname,
                gender: req.body.gender,
                email: req.body.email,
                birthdate: req.body.dob,
                profile: profile.name
            })
            .then(user => {
                console.log(req.files,req.body);
                statusCode = 201;
                responseData = {
                    code:statusCode,
                    status: "success",
                    data: user
                };
    
            })
            .catch(err => {
                if(err.name === "SequelizeUniqueConstraintError") {
                    responseData = {
                        errorMessage:{
                            email:{msg:err.errors[0].message}
                        }
                    };
                } else {
                    statusCode = 500;
                    responseData = {
                        error:err
                    };
                }
            })
        } else {
            statusCode = 400;
            responseData = {
                errorMessage:{
                    profile_photo:{msg:'only jpg/jpeg/png format allowed!'}
                }
            }
        }
    }
    return res.status(statusCode).send(responseData).end();
};


// Fetch user details from database
exports.findAll = async (req,res) => {
    let statusCode = 200;
    let responseData = {};

    await User.findAll()
    .then(user => {
        responseData = {
            code:statusCode,
            message:"success",
            data:user
        };
    })
    .catch(err => {
        statusCode=500;
        responseData = {
            error:err
        };
    });
    return res.status(statusCode).send(responseData).end();
};

// Fetch user details by id:
exports.findByPk = async (req,res) => {
    const id = req.params.id;
    let statusCode = 200;
    let responseData = {};

    await User.findByPk(id)
    .then(user => {
        if (user == null) {
            statusCode = 404;
            responseData = {
                code:statusCode,
                data: `user with ID = ${id} not found`
            };
        } else {
            responseData = {
                code:statusCode,
                status:'success',
                data:user
            };    
        }
    })
    .catch(err => {
        statusCode= 500;
        responseData = {
            error:err
        };
    })
    return res.status(statusCode).send(responseData).end();
};  
  
// Update User details by id
exports.update = async (req,res) => {
    const id = req.params.id;
    const errors = validationResult(req);
    console.log(errors.mapped());
    
    let statusCode = 422;
    let responseData = {};
    
    if(!errors.isEmpty()) {
        responseData = {
            errorMessage: errors.mapped()
        };
    } else {
        await User.update({ 
            firstName: req.body.fname,
            lastName: req.body.lname,
            gender: req.body.gender,
            email: req.body.email,
            birthdate: req.body.birthdate
        }, { where: { id: id } })
        .then(() => {
            statusCode = 200;
            responseData = {
                code:statusCode,
                status:'success',
                message:`update user successfully with id = ${id}`
            };
        })
        .catch(err => {
            if(err.name === "SequelizeUniqueConstraintError") {
                responseData = {
                    errorMessage:{
                        email:{msg:err.errors[0].message}
                    }
                };
            } else { 
                statusCode = 500;
                responseData = {
                    error: err
                };
            }
        })
    }    
    return res.status(statusCode).send(responseData).end();
};
// Delete user details by id
exports.delete = async (req,res) => {
    const id = req.params.id;
    let statusCode = 200;
    let responseData = {};
    let user_profile = await User.findOne({
        attributes: ["id", "profile"],
        where: { id: id },
    })
    .then(data => {
        return data;
    }).catch(e => {throw e})
    
    if(user_profile == null) {
        statusCode=404;
        responseData = {code:statusCode,data:`user not found with this id ${id}`}
    } else {
        let profile_name = user_profile.dataValues.profile;
        const path = './public/img/theme/'+profile_name;
        await User.destroy({where: { id: id}})
        .then(num => {
            if (num == 1) {
                try {
                    fs.unlinkSync(path)
                } catch(err) {
                    statusCode = 500;
                    responseData = {
                        error: err
                    }
                }
                responseData = {
                    code: statusCode,
                    message: `User with id=${id} was deleted successfully!`
                };
            }
        })
        .catch(err => {
            statusCode = 500;
            responseData = {
                error: err
            };
        })
    }
    return res.status(statusCode).send(responseData).end();
};

exports.validate = (method) => {
    switch (method) {
        case 'create': {
            return [
                check('fname').not().isEmpty().withMessage('Firstname is required!')
                    .isAlpha().withMessage('Special character and number are not allowed!')
                    .isLength({min:3,max:12}).withMessage('Firstname length must be between 3 to 12 char long'),
                check('lname').not().isEmpty().withMessage('Lastname is required!')
                    .isAlpha().withMessage('Special character and number are not allowed')
                    .isLength({min:3,max:12}).withMessage('Lastname length must be between 3 to 12 char long'),
                check('email').not().isEmpty().withMessage('Email is required!')
                    .isEmail().withMessage('Please Enter valid email!'),
                check('dob').not().isEmpty().withMessage('birthdate is required!!'),
                check('profile_photo')
                .custom((value,{req}) => {
                    console.log(req.files);
                    if(req.files === null) {
                        return false;
                    } else {
                        return true;
                    }
                }).withMessage('Please select a file!')
                ]   
            }
            case 'edit': {
                return [
                    check('fname').not().isEmpty().withMessage('Firstname is required!')
                        .isAlpha().withMessage('Special character and number are not allowed!')
                        .isLength({min:3,max:12}).withMessage('Firstname length must be between 3 to 12 char long'),
                    check('lname').not().isEmpty().withMessage('Lastname is required!')
                        .isAlpha().withMessage('Special character and number are not allowed')
                        .isLength({min:3,max:12}).withMessage('Lastname length must be between 3 to 12 char long'),
                    check('email').not().isEmpty().withMessage('Email is required!')
                        .isEmail().withMessage('Please Enter valid email!'),
                    check('dob').not().isEmpty().withMessage('birthdate is required!!')
                    ]   
                }
        case 'login': {
            return [
                check('email').not().isEmpty().withMessage('Email is required!')
                    .isEmail().withMessage('Please Enter valid email!'),
                check('password').not().isEmpty().withMessage('Password is required!')
                    .isLength({min:6}).withMessage('Password must be 6 character long')
                ]
            } 
        default:
            break;
    }
}