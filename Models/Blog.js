const blogSchema = require("../Schemas/Blog");

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

}

module.exports = Blog