const blogSchema = require("../Schemas/Blog");
const constants = require("../constants");
const ObjectId = require("mongodb").ObjectId;

const Blog = class{
    title;
    textBody;
    userId;
    createDatetime;

    constructor({title, textBody, userId, createDatetime}){
        this.title = title;
        this.textBody = textBody;
        this.userId = userId;
        this.createDatetime = createDatetime;
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
}

module.exports = Blog