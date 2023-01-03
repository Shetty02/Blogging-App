const validator = require("validator");

function cleanUpAndValidate (username, email, password){

    return new Promise((resolve, reject) => { 

        if(!email || !password || ! username){
            return reject("Missing Credentials");
        }
    
    if(typeof(email) !=="string"){
        return reject("Email is not a String");
    }
    if(typeof(username) !=="string"){
        return reject("Username is not a String");
    }
    if(typeof(password) !=="string"){
        return reject("Password is not a String");
    }
    if(!validator.isEmail(email)){
        return reject("Invalid email format");
    }
    if(username.length < 3 || username.length >30){
        return reject("The length oof the Username should br between 3-30 characters");
    } 

    return resolve();
});
}

module.exports = cleanUpAndValidate;