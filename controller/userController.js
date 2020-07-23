const db = require("../util/database");
const User = db.users;
const { validationResult } = require('express-validator');
const fs = require('fs');

// POST User details to database
exports.create = (req,res) => {    
    console.log(req.file);
    const errors = validationResult(req);
    console.log(errors.mapped());
    if(!errors.isEmpty()) {
        res.status(422).json({
            errorMessage: errors.mapped()
    })
    } else {
        if(req.body.birthdate === '' && req.file === undefined) {
            res.status(422).send({errorMessage: {
                birthdate: {msg:'Birthdate is requied!'},
                profile: {msg:'Profile_Photo is required!'}    
            }})
        } else if (req.body.birthdate === '') {
            res.status(422).send({errorMessage:{
                birthdate:{msg:'Birthdate is required!'}
            }})
        } else if(req.file === undefined) {
            res.status(422).send({errorMessage:{
                profile:{msg:'Profile_Photo is required!'}
            }})
        } else {
            User.create({
                firstName: req.body.fname,
                lastName: req.body.lname,
                gender: req.body.gender,
                email: req.body.email,
                birthdate:  req.body.birthdate,
                profile: req.file.filename
            })
            .then(user => {
                res.status(201).json({
                    code:201,
                    status: "success",
                    data: user
                });
            })
            .catch(err => {
                if(err.name === "SequelizeUniqueConstraintError") {
                    res.status(422).send({errorMessage:{
                        email:{msg:err.errors[0].message}
                    }})
                } else { 
                    res.send(err)
                }
            });
        }
    }
};


// Fetch user details from database
exports.findAll = (req,res) => {
    User.findAll()
    .then(user => {
    res.status(200).json({
            "code":200,
            "message":"success",
            "data":user
        });
    })
    .catch(err => {
        console.log(err);
    });
};

// Fetch user details by id:
exports.findByPk = (req,res) => {
    const id = req.params.id;
    User.findByPk(id)
    .then(user => {
        res.json(user);
    })
    .catch(err => { 
        console.log(err);
    });
};  
  
// Update User details by id
exports.update = (req,res) => {
    console.log(req.body);
    const id = req.params.id;
    const errors = validationResult(req);
    console.log(errors.mapped());
    if(!errors.isEmpty()) {
        res.status(422).json({
            errorMessage: errors.mapped()
    })
    } else {
        if(req.body.birthdate === '') {
            res.status(422).send({errorMessage:{
                birthdate:{msg:'Birthdate is required!'}
            }})
        } else {
            User.update({ 
                firstName: req.body.fname,
                lastName: req.body.lname,
                gender: req.body.gender,
                email: req.body.email,
                birthdate: req.body.birthdate
            }, { where: { id: id } })
            .then(() => {
                res.status(200).send({
                    code:200,
                    message:`update user successfully with id+${id}`
                });
            })
            .catch(err => {
                if(err.name === "SequelizeUniqueConstraintError") {
                    res.status(422).send({errorMessage:{
                        email:{msg:err.errors[0].message}
                    }})
                } else { 
                    res.send(err)
                }
            });
        }    
    }
};
// Delete user details by id
exports.delete = async (req,res) => {
    const id = req.params.id;
    let user_profile = await User.findOne({
        attributes: ["id", "profile"],
        where: { id: id },
    }).then(data => {return data});

    let profile_name = user_profile.dataValues.profile;
    const path = './public/img/theme/'+profile_name;
    User.destroy({where: { id: id}})
    .then(num => {
        if (num == 1) {
            try {
                fs.unlinkSync(path)
            } catch(err) {
                console.error(err)
            }
            res.send({
                message: `User with id=${id} was deleted successfully!`
            });
        } else {
            res.send({
            message: `Cannot delete User with id=${id}. Maybe User was not found!`
            });
        }
    })
    .catch(err => {
        console.log(err);
    });
};
