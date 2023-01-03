const mongoose = require("mongoose");
const clc = require("cli-color");

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then((res)=>{
    console.log(clc.bgCyan("Connected to MongoDb Succefully"))
})
.catch((err)=>{
    console.log(clc.red("Failed to connect", err));
})