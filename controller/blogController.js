const db = require("../util/database");
const Blog = db.blog;
const { check,validationResult } = require('express-validator');

// Post blog deteails
exports.blogCreate = async (req,res) => {
    let statusCode = 422;
    let responseData = {};
    const blogTitle = req.body.title;
    const blogDesc = req.body.description;
    const blogPublish = req.body.publish;
    const loginId = req.body.loginId
    let errors = validationResult(req);
    console.log(errors.mapped());
    
    if(!errors.isEmpty()) {
        responseData = {
            errorMessage: errors.mapped()
        };
    } else {
        await Blog.create({
            title: blogTitle,
            description: blogDesc,
            publish_date: blogPublish,
            created_by: loginId
        })
        .then(blog => {
            statusCode = 200;
            responseData = {
                code:statusCode,
                data:blog
            }
        })
        .catch(err => {
            statusCode = 500;
            responseData = {
                err:err
            }
        })
    }
    return res.status(statusCode).send(responseData).end();
}

// Fetch all blog details 
exports.blogAll = async (req,res) => {
    let statusCode = 200;
    let responseData = {};

    await Blog.findAll()
    .then(blog=> {
        responseData = {
            code:statusCode,
            message:"success",
            data:blog
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

// Fetch blog details by id
exports.blogById = async (req,res) => {
    const id = req.params.id;
    let statusCode = 200;
    let responseData = {};

    await Blog.findByPk(id)
    .then(blog => {
        if (blog == null) {
            statusCode = 404;
            responseData = {
                code:statusCode,
                data: `blog with ID = ${id} not found`
            };
        } else {
            responseData = {
                code:statusCode,
                status:'success',
                data:blog
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
exports.blogUpdate = async (req,res) => {
    const id = req.params.id;
    const loginId = req.params.loginId

    const errors = validationResult(req);
    console.log(errors.mapped());
    
    let statusCode = 422;
    let responseData = {};
    let blog_detail = await Blog.findOne({
        attributes: ["id", "title","created_by"],
        where: { id: id },
    })
    .then(blog => {
        return blog;
    }).catch(e => {throw e})

    if(!errors.isEmpty()) {
        responseData = {
            errorMessage: errors.mapped()
        };
    } else if(blog_detail == null) {
        statusCode=404;
        responseData = {
            code:statusCode,
            data:`blog not found with this id ${id}`
        };
    } else {
        let blog_created_id = blog_detail.created_by;
        console.log(blog_created_id);
        if(blog_created_id == loginId) {
            await Blog.update({
                title: blogTitle,
                description: blogDesc,
                publish_date: blogPublish,
            }, { where: { id: id } })
            .then(() => {
                statusCode = 200;
                responseData = {
                    code:statusCode,
                    message:`update blog successfully with id = ${id}`
                };
            })
            .catch(err => {
                statusCode = 500;
                responseData = {
                    error: err
                };
            })
        } else {
            statusCode = 401;
            responseData = {
                code:statusCode,
                data:'you can edit this blog!'
            };
        }
    };
    return res.status(statusCode).send(responseData).end();
}
// DELETE blog by who create it with its id
exports.deleteBlog = async (req,res) => {
    const id = req.params.id;
    const loginId = req.params.loginId
    let statusCode = 200;
    let responseData = {};
    let blog_detail = await Blog.findOne({
        attributes: ["id", "title","created_by"],
        where: { id: id },
    })
    .then(blog => {
        return blog;
    }).catch(e => {throw e})
    if(blog_detail == null) {
        statusCode=404;
        responseData = {
            code:statusCode,
            data:`blog not found with this id ${id}`
        };
    } else {
        let blog_created_id = blog_detail.created_by;
        console.log(blog_created_id);
        if(blog_created_id == loginId) {
            await Blog.destroy({where: { id: id}})
            .then(num => {
                if (num == 1) {
                    responseData = {
                        code: statusCode,
                        message: `blog with id=${id} was deleted successfully!`
                    };
                }
            })
            .catch(err => {
                statusCode = 500;
                responseData = {
                    error: err
                };
            })
        } else {
            statusCode = 401;
            responseData ={
                code:statusCode,
                data: 'you can not delete this blog!'
            }
        }
    }
    return res.status(statusCode).send(responseData).end();
};

// validate blog field
exports.validate = (method) => {
    switch (method) {
        case 'create': {
            return [
                check('title').not().isEmpty().withMessage('Title is required!')
                    .isLength({min:3,max:12}).withMessage('Title length must be between 3 to 12 char long'),
                check('description').not().isEmpty().withMessage('description is required!'),
                check('publish').not().isEmpty().withMessage('birthdate is required!!')
                    ]   
                }
        case 'edit': {
            return [
                check('title').not().isEmpty().withMessage('Title is required!')
                    .isLength({min:3,max:12}).withMessage('Title length must be between 3 to 12 char long'),
                check('description').not().isEmpty().withMessage('description is required!'),
                check('publish').not().isEmpty().withMessage('birthdate is required!!')
                ]   
            }
        default:
            break;
    }
}