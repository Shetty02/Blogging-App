const express = require("express");
const BlogRouter = express.Router();
const blogValidation = require("../Utils/BlogUtils");   
const User = require("../Models/User");
const Blog = require("../Models/Blog");

BlogRouter.post("/create-blog", (req, res)=>{
    const title = req.body.title;
    const textBody = req.body.textBody;
    const userId = req.session.user.userId;
    const createDatetime = new Date();

    console.log(req.session.user)

    blogValidation (title, textBody, userId, createDatetime)
    .then( async()=>{
         // Validating if the userId.     
         try{
            await User.verifyUserId({ userId });
        }
        catch(err){
            return res.send({
                status:401,
                message:"Error Occured",
                error: err
            })
        }

        const blog = new Blog({title, textBody, userId, createDatetime})
        try {
            const blogDb = await blog.createBlog();
            // console.log(blogDb)
            return res.send({
                status:201,
                message:"Blog Created Succesfully.",
                data: blogDb
            })
        } catch (err) {
            return res.send({
                status:401,
                message:"Error Occurred",
                error: err
            })            
        }
    })
    .catch((err)=>{
        return res.send({
            status:400,
            message:"Invalid Data",
            error:err
        })
    })
})

BlogRouter.get("/get-blogs", async(req, res)=>{
    const offset = req.query.offset || 0;
    try {
       const blogs = await Blog.getBlogs({ offset })

       return res.send({
        status: 200,
        message:"Read Successfully",
        data: blogs
       })
    } catch (err) {
        return res.send({
            status:400,
            message:"Read Unsuccessfully",
            error: err
        })        
    }
})
BlogRouter.get("/my-blogs", async(req, res)=>{
    const userId = req.session.user.userId;
    const offset = req.query.offset || 0;
    try {
       const blogs = await Blog.myBlogs({ offset, userId})
       return res.send({
        status: 200,
        message:"Read Successfully",
        data: blogs
       })
    } catch (err) {
        return res.send({
            status:400,
            message:"Read Unsuccessfully",
            error: err
        })        
    }
})

module.exports = BlogRouter