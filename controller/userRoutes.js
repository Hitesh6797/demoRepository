const fetch = require('node-fetch');
const config = require('../env/config');
const { users } = require('../util/database');
const jwt = require("jsonwebtoken");

module.exports = function(app) {
    
    const users = require('../controller/userController');

    // Create a new Customer

    app.post('/api/users',users.checkToken, users.create);
 
    // Retrieve all Customer
    app.get('/api/users',users.findAll);
 
    // Retrieve a single Customer by Id
    app.get('/api/users/:id',users.findByPk);
 
    // Update a Customer with Id
    app.put('/api/users/:id',users.checkToken, users.update);
 
    // Delete a Customer with Id
    app.delete('/api/users/:id',users.checkToken, users.delete);

    // // login with jwt token
    app.post('/admin/login',users.login);
    
    // Logout with jwt 
    // app.post('/logout' , users.checkToken, (req, res) => {
    //     req.logOut();
    //     res.status(200).send(["logged out"]).redirect('/');
    //     });
        
    const url_get_all = config.url+'api/users';
    const getAllUserDetails = async url_get_all => {
    try {
        const response = await fetch(url_get_all);
        const json = await response.json();
        return json
        // console.log(json);
    } catch (error) {
        console.log(error);
    }   
    };
    // getAllUserDetails(url_get_all);

    app.get('/users',async function(req,res) {
        const result = await getAllUserDetails(url_get_all)
        console.log(result);
            
        res.render('pages/userDetails',{ user:result.data });
    })
    
    const url_get_one = config.url+'api/users/';
    const getOneUserDetails = async url_get_one => {
    try {
        const response = await fetch(url_get_one);
        const json = await response.json();
        return json;
        // console.log(json);
    } catch (error) {
        console.log(error);
    }   
    };
    // getOneUserDetails(url_get_one);
    
    app.get('/editUser/:id',async function(req,res) {
        var id = req.params.id;
        const result = await getOneUserDetails(url_get_one+id)
        console.log(result);
            
        res.render('pages/editUser',{ data: result });
    })

    app.get('/',function(req,res){
        res.render('pages/login',{login: users.login});
    });
      

    app.get('/addUser', function(req,res) {
        res.render('pages/addUser');
    });

    app.get('/404', function(req,res) {
        res.render('pages/404');
    });
    
    app.get('/dashboard',function(req,res)  {
        res.render('pages/dashboard')
    });

    app.get('/register',function(req,res)  {
        res.render('pages/register')
    });

    // app.get('/profile',function(req,res){
    //     res.render('pages/profile');
    // });
      
    app.get('/icons', (req, res) => {
        jwt.verify(req.token, config.accessTokenSecret, (err, authorizedData) => {
            if(err){
                //If error send Forbidden (403)
                console.log(err);            
                res.status(403).send({
                    code: 403,
                    "message": "invalid jwt given!"
                });
            } else {
                res.render('pages/icons');
            }
        });
    });
        
    app.get('/tables' , function(req, res) {
        res.render('pages/tables');
    });  
        
    // app.use((req, res) => {
    //     res.status(404).render('pages/404');
    //   });


}