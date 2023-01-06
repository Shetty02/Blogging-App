const mongoose = require("mongoose");
const  Schema = mongoose.Schema;

const followSchema = new Schema({
    followingUserId:{
        type: String,
        required: true
    },
    followerUserId:{
        type: String,
        required: true
    },
    createDatetime:{
        type: String,
        required:true
    },
})

module.exports = mongoose.model("follow",followSchema)