const fetch = require('node-fetch');
require('dotenv').config();
const users = require('../controller/userController');
const adminLogin = require('../controller/login');
const { check } = require('express-validator');
const multer = require('multer');


const fileStorage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, './public/img/theme/');
    },
    filename: function(req,file,cb){
        cb(null, file.originalname);
    }
});

const fileFilter = (req,file,cb) => {
    if(file.mimetype === 'image/jpeg' ||file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null,true);
    } else {
        cb(null,false);
    }
};

const upload = multer({
    storage: fileStorage,
    limits: {
        fileSize: 1024*1024*5
    },
    fileFilter:fileFilter
});

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    var localStorage = new LocalStorage('./scratch');
}

module.exports = function(app) {
    
    // Create a new Customer        
    
    app.post('/api/users', adminLogin.checkLogin, upload.single('file'), [
        check('fname').not().isEmpty().withMessage('Firstname is required!')
            .isAlpha().withMessage('Firstname doesnot contain special char and number!')
            .isLength({min:3,max:12}).withMessage('Firstname length must be between 3 to 12 char long'),
        check('lname').not().isEmpty().withMessage('Lastname is required!')
            .isAlpha().withMessage('Lastname doesnot contain special char and number!')
            .isLength({min:3,max:12}).withMessage('Lastname length must be between 3 to 12 char long'),
        check('email').not().isEmpty().withMessage('Email is required!')
            .isEmail().withMessage('Enter a valid Email address!'),
        check('birthdate','birthdate is require').not().isEmpty()
        ], users.create);
            
    // Retrieve all Customer
    app.get('/api/users',adminLogin.checkLogin, users.findAll);
 
    // Retrieve a single Customer by Id
    app.get('/api/users/:id',adminLogin.checkLogin, users.findByPk);
 
    // Update a Customer with Id
    app.put('/api/users/:id',adminLogin.checkLogin, users.update);
 
    // Delete a Customer with Id
    app.delete('/api/users/:id',adminLogin.checkLogin, users.delete);

    // // login with jwt token
    app.post('/admin/login',[
        check('email').not().isEmpty().withMessage('Email is required!')
            .isEmail().withMessage('Please Enter valid email!'),
        check('password').not().isEmpty().withMessage('Password is required!')
            .isLength({min:6}).withMessage('Password must be 6 character long')
        ],adminLogin.login);
    
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

    app.get('/users', adminLogin.checkLogin, async function(req,res) {            
        const result =  await getAllUserDetails(url_get_all)
            console.log(result);
        res.render('pages/userDetails',{ user:result.data });
    });
    
    const url_get_one = process.env.url+'api/users/';
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
    
    app.get('/users/editUser/:id', adminLogin.checkLogin ,async function(req,res) {
        var id = req.params.id;
        const result = await getOneUserDetails(url_get_one+id)
        console.log(result);
            
        res.render('pages/editUser',{ data: result });
    })

    app.get('/users/viewUser/:id', adminLogin.checkLogin ,async function(req,res) {
        var id = req.params.id;
        const result = await getOneUserDetails(url_get_one+id)
        console.log(result);
            
        res.render('pages/viewUser',{ data: result });
    })

    app.get('/',function(req,res){
        res.render('pages/login');
    });
      
    app.get('/users/addUser',adminLogin.checkLogin, function(req,res) {
        res.render('pages/addUser');
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
    app.get('*', function(req, res){
        res.render('pages/404');
    })
}