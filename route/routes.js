const fetch = require('node-fetch');
require('dotenv').config();
const users = require('../controller/userController');
const adminLogin = require('../controller/login');
const resetController = require('../controller/resetPassword');
const fileUpload = require('express-fileupload');

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    var localStorage = new LocalStorage('./scratch');
}

module.exports = function(app) {

    // POST Create a new Customer
    app.use(fileUpload({createParentPath:true}));
    let POSTmiddleware = [adminLogin.checkLogin, users.validate('create'), users.create];

    app.post('/api/users',POSTmiddleware);

    // GET Retrieve all Customer
    app.get('/api/users',adminLogin.checkLogin, users.findAll);
 
    // GET Retrieve a single Customer by Id
    app.get('/api/users/:id',adminLogin.checkLogin, users.findByPk);
 
    // PUT Update a Customer with Id
    app.put('/api/users/:id',adminLogin.checkLogin,users.validate('edit'), users.update);
 
    // DELETE Delete a Customer with Id
    app.delete('/api/users/:id',adminLogin.checkLogin,users.delete);
      
    // GET login page 
    app.get('/',function(req,res){
        res.render('login/login');
    });

    // POST login with jwt token
    app.post('/admin/login',users.validate('login'),adminLogin.login);
    
    // GET Forgot password page
    app.get('/forgot-password',function(req,res) {
        res.render('login/forgot-password');
    })

    // POST send mail for reset password link
    app.post('/forgot-password',resetController.postReset);

    // GET To Reset password link open from mail 
    app.get('/reset-password/:token',resetController.getNewPassword);

    // POST change new password convert in hashPassword using brcryptjs, save into database using
    app.post('/reset-password',resetController.postNewPassword);

    // POST logout from application and remove JWT token from localstorage
    app.get('/admin/logout',adminLogin.checkLogin,(req,res) => {
        localStorage.removeItem('token');
        res.send("logout success!!")
    })

    const url_get_all = process.env.url +'api/users';
    const getAllUserDetails = async url_get_all => {
    try {
        const response = await fetch(url_get_all);
        const json = await response.json();
        return json
    } catch (error) {
        console.log(error);
    }   
    };

    // GET All user details 
    app.get('/users', adminLogin.checkLogin, async function(req,res) {            
        const result =  await getAllUserDetails(url_get_all)
        res.render('user/userDetails',{ user:result.data });
    });
    
    const url_get_one = process.env.url+'api/users/';
    const getOneUserDetails = async url_get_one => {
    try {
        const response = await fetch(url_get_one);
        const json = await response.json();
        return json;
    } catch (error) {
        console.log(error);
    }   
    };

    // GET edit user page by its id
    app.get('/users/editUser/:id', adminLogin.checkLogin ,async function(req,res) {
        var id = req.params.id;
        const result = await getOneUserDetails(url_get_one+id)
        res.render('user/editUser',{ data: result.data });
    })

    // GET views user by its id
    app.get('/users/viewUser/:id', adminLogin.checkLogin ,async function(req,res) {
        var id = req.params.id;
        const result = await getOneUserDetails(url_get_one+id)
        console.log(result);
        res.render('user/viewUser',{ data: result.data });
    })
      
    // GET add user page
    app.get('/users/addUser',adminLogin.checkLogin, function(req,res) {
        res.render('user/addUser');
    });

    // GET blog details
    app.get('/blog',function(req,res){
        res.render('blog/blogdetails');
    });

    app.get('/403', function(req,res) {
        res.render('pages/403');
    });
    app.get('/404', function(req,res) {
        res.render('pages/404');
    });
    
    app.get('/dashboard',adminLogin.checkLogin, function(req,res)  {
        res.render('pages/dashboard')
    });

    app.get('/icons',adminLogin.checkLogin,(req,res) => {
        res.render('pages/icons');
    });

    app.get('/tables' ,adminLogin.checkLogin, function(req, res) {
        res.render('pages/tables');
    });  
    // app.get('*', function(req, res){
    //     res.render('pages/404');
    // })
}