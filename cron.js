const cron = require("node-cron");
const ObjectId = require("mongodb").ObjectId;
const blogSchema = require("./Schemas/Blog");

function cleanUpBin(){
    // console.log("In the bin");
    cron.schedule('1 * * * * *',async () => {
        // Finding all the blogs marked as deleted:true
        const blogsDb = await blogSchema.aggregate([ { $match: {deleted: true}}]);
        // console.log(blogsDb);

        blogsDb.forEach(async(blog)=>{
          const deletionDatetime = new Date(blog.deletionDatetime).getTime();
          const currentDateTime = Date.now();
          // console.log(deletionDatetime);
          // console.log(currentDateTime);

          // const diff = (currentDateTime - deletionDatetime)/(1000*60);
          const diff = (currentDateTime - deletionDatetime)/(1000*60*60*24);
          // console.log(diff);
          if( diff >= 30){
            await blogSchema.findOneAndDelete({ _id: ObjectId(blog._id)});
            console.log(`Blog has been deleted:${blog._id}`)
          }
        })
      },{
        scheduled: true,
        timezone:"Asia/Kolkata",
      });
}

module.exports = { cleanUpBin } 