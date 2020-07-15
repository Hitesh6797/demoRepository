const db = require("../util/database");
const User = db.users;
const jwt = require("jsonwebtoken");

// POST User details to database
exports.create = (req,res) => {    
    console.log(req.file,req.body);

    var filename = req.file.originalname;
    User.create({
        firstName: req.body.fname,
        lastName: req.body.lname,
        gender: req.body.gender,
        email: req.body.email,
        birthdate:  req.body.birthdate,
        profile: filename
    })
    .then(user => {
        res.status(201).json({
            code:201,
            status: "success",
            data: user
        });
    })
    .catch(err => {
        res.send(err)
    }); 
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
    const id = req.params.id;
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
        console.log(err);
    });
};
// Delete user details by id
exports.delete = (req,res) => {
    const id = req.params.id;
    User.destroy({where: { id: id}})
    .then(num => {
        if (num == 1) {
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