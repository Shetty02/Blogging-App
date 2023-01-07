const express = require("express");
const { followerUser, followingUserList, followerUserList, unfollowUser } = require("../Models/Follow");
const FollowRouter = express.Router();
const User = require("../Models/User")

FollowRouter.post("/follow-user",async (req, res)=>{
        const followerUserId = req.session.user.userId;
        const followingUserId = req.body.followingUserId;

        console.log(followingUserId);
        console.log(followerUserId)
        
        // Validating both the followers and following userID.
        try{
            await User.verifyUserId({ userId : followerUserId });
        }
        catch(err){
            return res.send({
                status:401,
                message:"Invalid Follower userId",
                error: err
            })
        }
        try{
            await User.verifyUserId({ userId : followingUserId });
        }
        catch(err){
            return res.send({
                status:401,
                message:"Invalid Following userId",
                error: err
            })
        }

        try {
            const followDb = await followerUser({ followerUserId, followingUserId});
            return res.send({
                status:200,
                message:"Followed Successfully.",
                data: followDb
            })            
        } catch (error) {
            return res.send({
                status:400,
                message:"Request Interrupted.",
                error: error
            })
        }
})

// Here we are finding whom you are following.
FollowRouter.post("/following-list", async(req, res)=>{
    const followerUserId = req.session.user.userId;
    const offset = req.query.offset || 0;

    // Validating  the followeruserID.
        try{
            await User.verifyUserId({ userId : followerUserId });
        }
        catch(err){
            return res.send({
                status:401,
                message:"Invalid Follower userId",
                error: err
            })
        }
        try {
            const data = await followingUserList({followerUserId, offset});

            if(data.length === 0){
                return res.send({
                    status:200,
                    message:"You have not followed anyone yet 😒😎.",
                    data: data
                })
            }
            return res.send({
                status:200,
                message:"Following List",
                data: data
            })
        } catch (error) {            
            return res.send({
                status:400,
                message:"Error Occured",
                error: error,
            })
        }
})

// Here we are finding who follows you.
FollowRouter.post("/followers-list", async(req, res)=>{
    const followingUserId = req.session.user.userId;
    const offset = req.query.offset || 0;

    // Validating  the followinguserID.
        try{
            await User.verifyUserId({ userId : followingUserId });
        }
        catch(err){
            return res.send({
                status:401,
                message:"Invalid Following userId",
                error: err
            })
        }
        try {
            const data = await followerUserList({followingUserId, offset});

            if(data.length === 0){
                return res.send({
                    status:200,
                    message:"No one Follow you 🥹😭",
                    data: data
                })
            }
            return res.send({
                status:200,
                message:"Followers List",
                data: data
            })
        } catch (error) {            
            return res.send({
                status:400,
                message:"Error Occured",
                error: error,
            })
        }
})

FollowRouter.post("/unfollow-user", async(req, res)=>{
    const followingUserId = req.body.followingUserId;
    const followerUserId = req.session.user.userId; 

    // console.log(followingUserId);
    // console.log(followerUserId);
    
    // Validating both the followers and following userID.
    try{
        await User.verifyUserId({ userId : followerUserId });
    }
    catch(err){
        return res.send({
            status:401,
            message:"Invalid Follower userId",
            error: err
        })
    }
    try{
        await User.verifyUserId({ userId : followingUserId });
    }
    catch(err){
        return res.send({
            status:401,
            message:"Invalid Following userId",
            error: err
        })
    }

    try {
        const unfollowDb = await unfollowUser({ followerUserId, followingUserId});
        
        return res.send({
            status:200,
            message:"Unfollow Successfull.",
            data: unfollowDb
        })
        
    } catch (error) {
        return res.send({
            status:401,
            message:"Error Occurred",
            error: error
        })
        
    }
})
module.exports = FollowRouter;