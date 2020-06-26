const db = require("../util/database");
const User = db.users;
const config = require("../env/config");
const jwt = require("jsonwebtoken");
// const dateFormat = require('dateformat');
// Post user details to database

exports.create = (req,res) => {
    jwt.verify(req.token, config.accessTokenSecret, (err, authorizedData) => {
        if(err){
            //If error send Forbidden (403)
            console.log(err);            
            res.status(403).send({
                code: 403,
                "message": "invalid jwt given!"
            });
        } else {
            User.create({
                firstName: req.body.fname,
                lastName: req.body.lname,
                gender: req.body.gender,
                email: req.body.email,
                birthdate:  req.body.birthdate
            })
            .then(user => {
                res.status(201).json({
                    code:201,
                    status: "success",
                    data: user
                });
            })
            .catch(err => {
                console.log(err);
            });    
        }
    });
};


// Fetch user details from database
exports.findAll = (req,res) => {
    // jwt.verify(req.token, config.accessTokenSecret, (err, authorizedData) => {
    //     if(err){
    //         //If error send Forbidden (403)
    //         console.log(err);
    //         // console.log('ERROR: Could not connect to the protected route');
    //         res.status(403).send({"code":403,"message":"Invalid JWT token"});
    //     } else {
            User.findAll()
            .then(user => {
            res.status(200).json({
                    "code":200,
                    "message":"success",
                    "data":user
                });
                // res.render('dashboard',{user:user});
            })
            .catch(err => {
                console.log(err);
            });
    //     };
    // });  
};

// Fetch user details by id:
exports.findByPk = (req,res) => {
    // jwt.verify(req.token, config.accessTokenSecret, (err, authorizedData) => {
    //     if(err){
    //         //If error send Forbidden (403)
    //         console.log(err);
    //         // console.log('ERROR: Could not connect to the protected route');
    //         res.sendStatus(403);
    //     } else {
            const id = req.params.id;
            User.findByPk(id)
            .then(user => {
                res.json(user);
            })
            .catch(err => { 
                console.log(err);
            });
    //      };
    // });
};

// Update User details by id
exports.update = (req,res) => {
    jwt.verify(req.token, config.accessTokenSecret, (err, authorizedData) => {
        if(err){
            //If error send Forbidden (403)
            console.log(err);            
            res.status(403).send({
                code: 403,
                "message": "invalid jwt given!"
            });
        } else {
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
    });
};
// Delete user details by id
exports.delete = (req,res) => {
    jwt.verify(req.token, config.accessTokenSecret, (err, authorizedData) => {
        if(err){
            //If error send Forbidden (403)
            console.log(err);            
            res.status(403).send({
                code: 403,
                "message": "invalid jwt given!"
            });
        } else {            
            const id = req.params.id;
            User.destroy({where: { id: id}})
            // .then(() => {
            //     res.status(200).send({"code":200,"message":"user deleted"});
            // })
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
    });
};

// Login using admin and generate JWT token
exports.login = (req, res) => {

    if (req.body.email == "admin@argon.com" && req.body.password == "secret") {
        // Generate an access token
        const accessToken = jwt.sign(
            { username: req.body.email },
            config.accessTokenSecret,
            { expiresIn: '1h' },
        );
        res.status(200).send({
            "code":200,
            "x-access-token": accessToken,
          });
        
    } else if(req.body.email == "admin@argon.com" && req.body.password != "secret"){
        // return res.redirect(config.url);
        res.status(401).send({
            code:401,
            message:"Invalid password!!"
        });
        res.end();
    } else if(req.body.email != "admin@argon.com" && req.body.password == "secret"){
        res.status(401).send({
            code:401,
            message:"Invalid Username!!"
        });
        res.end();
    } else {
        res.status(401).send({
            "code":401,
            "message":"Username and password are incorrect!!"
        });
        res.end();
    }

};
exports.checkToken = (req, res, next) => {
    const header = req.headers['authorization'];
    // const token = localStorage.getItem('token');
    if(typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];
        req.token = token;

        next();
    } else {
        //If header is undefined return Forbidden (403)
        res.status(403).json({
            "code":403,
            "message": "forbidden"
        })
    }
};  
// // Logout 
// exports.logout = (req,res) => {
//     accessToken = null;
//     console.log(accessToken);
// }