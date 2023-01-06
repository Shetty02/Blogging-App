const followSchema = require("../Schemas/Follow");

function followerUser({followerUserId, followingUserId}){
        return new Promise(async(resolve, reject)=>{
            // Check if they already follow
            try {
                const followObj = await followSchema.findOne({
                    followerUserId,
                    followingUserId
                })
                if(followObj){
                    reject("User Already Follow")
                }

                // Creating new entry
                const follow = new followSchema({
                    followerUserId,
                    followingUserId,
                    createDatetime: new Date(),
                })

                try {
                    const followDb = await follow.save();
                    resolve(followDb);
                } catch (error) {
                    reject(error);
                }
            } catch (error) {
                reject(error);
            }
        })
}

module.exports = { followerUser }