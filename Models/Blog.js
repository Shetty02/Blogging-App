const blogSchema = require("../Schemas/Blog");
const constants = require("../constants");
const ObjectId = require("mongodb").ObjectId;

const Blog = class{
    title;
    textBody;
    userId;
    createDatetime;
    blogId;

    constructor({title, textBody, userId, createDatetime, blogId}){
        this.title = title;
        this.textBody = textBody;
        this.userId = userId;
        this.createDatetime = createDatetime;
        this.blogId = blogId;
    }

    createBlog(){
        return new Promise( async (resolve, reject)=>{
            this.title.trim();  // this is used for converting " absf asn sanf" into "absfasnsanf" means removing the space betwee the blogs
            this.textBody.trim();

            const blog = new blogSchema({
                title: this.title,
                textBody: this.textBody,
                userId: this.userId,
                createDatetime: this.createDatetime,
            })

            try {
                const blogDb = await blog.save();
                // console.log(blogDb)
                resolve(blogDb);
            } catch (err) {
                reject(err);
            }

        })
    }

    static getBlogs({offset}){
        return new Promise(async (resolve, reject)=>{
            try {
                const blogDb = await blogSchema.aggregate([
                    {$sort: {createDatetime : -1}}, // -1 for decreasing order.
                    { $facet : {
                        data : [
                            { $skip : parseInt(offset)},
                            { $limit : constants.BLOGSLIMIT},
                        ],
                    }},
                ]);
                            resolve(blogDb[0].data)
            } catch (error) {
                reject(error);
            }
        

        })
    }
    static myBlogs({offset, userId}){
        return new Promise(async (resolve, reject)=>{
            try {
                const blogDb = await blogSchema.aggregate([
                    { $match: {userId : ObjectId(userId)}},
                    {$sort: {createDatetime : -1}}, // -1 for decreasing order.
                    { $facet : {
                        data : [
                            { $skip : parseInt(offset)},
                            { $limit : constants.BLOGSLIMIT},
                        ],
                    }},
                ]);
                            resolve(blogDb[0].data)
            } catch (error) {
                reject(error);
            }
        

        })
    }
    getDataofBlogfromId(){
        return new Promise(async (resolve, reject)=>{
            try {
                const blog = await blogSchema.findOne({ _id: ObjectId(this.blogId)})
                resolve(blog)
            } catch (err) {
                reject(err);
            }
        })
    }

    updateBlog(){
        return new Promise(async (resolve, reject)=>{
            try {
               let newBlogdata = {};

               if(this.title){
                newBlogdata.title = this.title
               }

               if(this.textBody){
                newBlogdata.textBody = this.textBody
               }

                const oldData = await blogSchema.findOneAndUpdate({ _id: ObjectId(this.blogId)}, newBlogdata)
               return resolve(oldData)
            } catch (err) {
                reject(err);
            }
        }) 
    }

    deleteBlog(){
        return new Promise(async (resolve, reject)=>{
            try {
                const blog = await blogSchema.findOneAndDelete({ _id: ObjectId(this.blogId)})
                resolve(blog)
            } catch (err) {
                reject(err);
            }
        })
    }
}

module.exports = Blog