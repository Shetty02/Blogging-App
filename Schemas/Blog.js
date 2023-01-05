const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    textBody :{
        type: String,
        required: true
    },
    createDatetime: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    }

})

module.exports = mongoose.model("blogs", blogSchema)