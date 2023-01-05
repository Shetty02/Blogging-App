const express = require("express");
const AuthRouter = express.Router();
const cleanUpAndValidate = require("../Utils/AuthUtils");
const validator = require("validator")
const User = require("../Models/User");

// Home Page
AuthRouter.get("/",(req, res)=>{
    res.send("Welcome to blog app")
})

// Register Page
AuthRouter.post("/register",(req, res)=>{
        // console.log("Working fine.")
        const {name, username, email, phonenumber, password} = req.body;
        cleanUpAndValidate( username, email, password)
        .then(async ()=>{
            // console.log(req.body);
            
            // Validating if the user is already register.     
            try{
                await User.verifyUserNameAndEmailExists({username, email});
            }
            catch(err){
                return res.send({
                    status:401,
                    message:"Error Occured",
                    error: err
                })
            }

            // save the user in Db.
            const user = new User({
                email,
                username,
                name,
                phonenumber,
                password
            })
            try{
                const userDb = await user.registerUser()

                return res.send({
                    status:201,
                    message:"Register Successfully",
                    data: userDb
                })
            }
            catch(err){
                return res.send({
                    status:401,
                    message:"Error Occured",
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
        // return res.send({
        //     status:200,
        // })
});

// Login Page
AuthRouter.post("/login",async (req, res)=>{
    // console.log("Working fine login.")
    const {loginId, password} = req.body;
    if(!loginId || !password){
        return res.send({
            status:400,
            message:"Missing Credentials."
        })
    }

    try{
        const userDb = await User.loginUser({loginId, password});

        req.session.isAuth = true;
        req.session.user ={
            userId : userDb._id,
            name: userDb.name,
            username: userDb.username,
            email: userDb.email
        }

        return res.send({
            status:200,
            message:"Login Successfully",
            data:userDb
        })
    }
    catch(err){
        return res.send({
            status:401,
            message:"Error Occured",
            Error: err
        })
    }
})

AuthRouter.post("/logout", (req,res)=>{
    const userData = req.session.user;
    req.session.destroy((err)=>{
        if(err){
           return res.send({
                status:400,
                message:"Logout Unsuccessfull.",
                error: err
            })
        }

        return res.send({
            status:200,
            message:"Logout Successfully.",
            data:userData
        })
    })
})
module.exports = AuthRouter;