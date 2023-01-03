const express = require("express");
const AuthRouter = express.Router();
const cleanUpAndValidate = require("../Utils/AuthUtils");
const validator = require("validator")

AuthRouter.post("/register",(req, res)=>{
        // console.log("Working fine.")
        const {name, username, email, phonenumber, password} = req.body;
        cleanUpAndValidate( username, email, password)
        .then(()=>{
            console.log(req.body);
            return res.send({
                status:200,
                message:"User has been Created",
            })
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

AuthRouter.post("/login",(req, res)=>{
    console.log("Working fine login.")
        return res.send({
            status:200,
        })
})

module.exports = AuthRouter;