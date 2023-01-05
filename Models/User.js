const userSchema = require("../Schemas/User");
const validator = require("validator");
const bcrypt = require("bcrypt");
const ObjectId = require("mongodb").ObjectId  // this is for cheking the userId is of datatype of ObjectId.

const User = class {
    username;
    name;
    email;
    phonenumber;
    password;

    constructor({username, name, password, phonenumber, email}){
        this.email = email;
        this.name = name;
        this.password = password;
        this.username = username;
        this.phonenumber = phonenumber;
    }

    //For checking if user exists or not.
    static verifyUserNameAndEmailExists({username, email}){
        return new Promise(async (resolve, reject)=>{
            try{
                const userDb = await userSchema.findOne({
                    $or: [{username}, {email}],
                })
                // console.log(userDb);
                // console.log("User didn't exists");
                if(userDb && userDb.email === email){
                    return reject("Email is Already Exists.")
                }
                if(userDb && userDb.username === username){
                    return reject("Username is Already taken.")
                }

                return resolve();
            }
            catch(err){
                reject(err);
            }
              
        })

    }

    // for storing the data in mongoDb.
    registerUser(){
        return new Promise(async (resolve, reject)=>{
            
            const hashedpassword = await bcrypt.hash(this.password, 12);

            const user = new userSchema({
                username: this.username,
                name: this.name,
                email: this.email,
                phonenumber: this.phonenumber,
                password:hashedpassword 
            })
    
            try{
                const userDb = await user.save();
                return resolve(userDb);
            }
            catch(err){
                reject(err);
            }

        })
    }

    // For Login 
    static loginUser({loginId, password}){
        return new Promise( async(resolve, reject)=>{
            let userDb = {};
            if(validator.isEmail(loginId)){
                userDb = await userSchema.findOne({email : loginId})
            }
            else{
                userDb = await userSchema.findOne({username : loginId})
            }


            if(!userDb){
                return reject("No user Found");
            }

            // Match the password
            const isMatch = await bcrypt.compare(password, userDb.password);
            if(!isMatch){
                return reject("Password do not Match.");
            }
            return resolve(userDb);
        })
    }

    static verifyUserId({ userId }){
        return new Promise(async (resolve, reject)=>{             
            try{
                if(!ObjectId.isValid(userId)){
                    reject("Invalid userId");
                }
                const userDb = await userSchema.findOne({_id: ObjectId(userId)});
                if(!userDb){
                    reject("No user Found");
                }
                // console.log("Hi",userDb);
                resolve(userDb);
            }
            catch(err){
                reject(err);
            }
        })
        
    }
}

module.exports = User