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

BlogRouter.post("/edit-blog", async (req, res)=>{
    const{ title, textBody } = req.body.data;
    const blogId = req.body.blogId;
    const userId = req.session.user.userId;

    // Here we are validating that title or texbody is present or not.
    if(!title && !textBody){
        return res.send({
            status: 400,
            message:"Invalid Data Format",
        })
    }
    try {
        // Here we are getting the blodId.
        const blog = new Blog({ blogId, title, textBody})
        const blogDb = await blog.getDataofBlogfromId();
        console.log(blogDb);

        // Here we are Checking the blogs owner with user present in the session.
        if(!blogDb.userId.equals(userId) ){
            return res.send({
                status:402,
                message:"Not allowed for Edit blog.",
                message:"Blog belongs to Other user"
            })
        }

        // Here we put check if creationtime is less than 30 min so we can edit the blogs.
        const currentDateTime = Date.now();
        const createDatetime = new Date(blogDb.createDatetime); // converted String into date object
        
        const diff = (currentDateTime - createDatetime.getTime()) /(1000 * 60)
        // console.log(diff);

        if(diff > 30) {
            return res.send({
                status:405,
                message:"Edit Unsuccessful.",
                error:"Cannot edit after 30 mins of creation."
            })
        }

        // Everything is Fine now we can edit the blog.
         try {
            const oldblogDb = await blog.updateBlog()
            return res.send({
                status:200,
                message:"Updation Successfull.",
                data:oldblogDb,
            })
         } catch (err) {
            return res.send({
                status: 400,
                message:"Updation Unsuccessfull.",
                error: err
            })
            
         }        
    } catch (err) {
        return res.send({
            status: 400,
            message:"Updation Unsuccessfull.",
            error: err
        })        
    }
})

BlogRouter.post("/delete-blog", async(req, res)=>{
    const blogId = req.body.blogId;
    const userId = req.session.user.userId;

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

    try {
        // Here we are getting the blodId.
        const blog = new Blog({ blogId})
        const blogDb = await blog.getDataofBlogfromId();
        console.log(blogDb);

        // Here we are Checking the blogs owner with user present in the session.
        if(!blogDb.userId.equals(userId) ){
            return res.send({
                status:402,
                message:"Not allowed for Delete blog.",
                message:"Blog belongs to Other user"
            })
        }

        const blogData = await blog.deleteBlog();
        return res.send({
            status: 400,
            message:"Deletion Successfull.",
            data: blogData
        })
    } catch (err) {return res.send({
        status: 400,
        message:"Deletion Unsuccessfull.",
        error: err
    })
        
    }
})
module.exports = BlogRouter