const express = require("express");
const { followerUser } = require("../Models/Follow");
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

module.exports = FollowRouter;