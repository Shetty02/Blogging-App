const followSchema = require("../Schemas/Follow");
const ObjectId = require("mongodb").ObjectId;
const userSchema = require("../Schemas/User");
const constants = require("../constants");

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
function followingUserList({followerUserId, offset}){
    return new Promise(async (resolve, reject)=>{
        try {
            const followDb = await followSchema.aggregate([
                {$sort: {createDatetime : -1}}, // -1 for decreasing order.
                { $facet : {
                    data : [
                        { $skip : parseInt(offset)},
                        { $limit : constants.BLOGSLIMIT},
                    ],
                }},
            ]);
                        // resolve(blogDb[0].data)
            
            // .find({followerUserId});
            
    // Create an array followingUserId
    let followingUserIds = [];
    followDb[0].data.forEach((followObj)=>{
        followingUserIds.push(ObjectId(followObj.followingUserId))
    })
    
    const followingUserDetails = await userSchema.aggregate([
        {
            $match:{
                _id: {
                    $in: followingUserIds 
                },
            },
        },
    ]);

    // console.log(followingUserDetails);
    resolve(followingUserDetails)
        } catch (error) {
            reject(error);
        }
    });
}
function followerUserList({followingUserId, offset}){
    return new Promise(async (resolve, reject)=>{
        try {
            const followDb = await followSchema.aggregate([
                {$sort: {createDatetime : -1}}, // -1 for decreasing order.
                { $facet : {
                    data : [
                        { $skip : parseInt(offset)},
                        { $limit : constants.BLOGSLIMIT},
                    ],
                }},
            ]);
                        // resolve(blogDb[0].data)
            
            // .find({followingUserId});
            
    // Create an array followerUserId
    let followerUserIds = [];
    followDb[0].data.forEach((followObj)=>{
        followerUserIds.push(ObjectId(followObj.followerUserId))
    })
    
    const followerUserDetails = await userSchema.aggregate([
        {
            $match:{
                _id: {
                    $in: followerUserIds 
                },
            },
        },
    ]);

    // console.log(followerUserDetails);
    resolve(followerUserDetails)
        } catch (error) {
            reject(error);
        }
    });
}
function unfollowUser({ followingUserId, followerUserId}){
    return new Promise(async (resolve, reject)=>{
        try {
             const unfollowDb = await followSchema.findOneAndDelete({
                followerUserId,
                followingUserId
             })           
             resolve(unfollowDb);
        } catch (error) {
            reject(error);
        }
    })

}
module.exports = { followerUser, followingUserList, followerUserList, unfollowUser}