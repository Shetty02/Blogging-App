function blogValidation(title, textBody, userId, createDatetime){

    return new Promise((resolve, reject)=>{
        
        if(!userId){
         reject("Invalid userId");   
        }
        if( !title || !textBody || typeof(title) !== "string" || typeof(textBody) !== "string" ){
            reject("Data Invalid");
        }

        if(title.length > 50){
            reject("Blog Title is too long. Should be less than 50 Character.")
        }
        
        if(textBody.length > 1000){
            reject("Blog is too long. Should be less than 1000 Character.")
        }
         
        return  resolve();
    });
}

module.exports = blogValidation;