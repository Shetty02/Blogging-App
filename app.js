const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const clc = require("cli-color")
const app = express();
const PORT = process.env.PORT;
const session = require("express-session");
const mongoDBSession = require("connect-mongodb-session")(session);

// file import
const db = require("./db")
const AuthRouter = require("./Controllers/Auth");
const BlogRouter = require("./Controllers/Blog");
const isAuth = require("./Middlewares/isAuth");
const FollowRouter = require("./Controllers/Follow");
const { cleanUpBin } = require("./cron");

//database Connection.


//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended : true}));

const store = new mongoDBSession({
    uri : process.env.MONGODB_URL,
    collection : "session"
})

app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        store:store
    })
)
//Routes
// app.get('/',(req, res)=>{
//     res.send("Welcome to blog app")
// })
app.use("/", AuthRouter);

// Routing
app.use("/auth", AuthRouter);
// Blogging Routes
app.use("/blog", isAuth, BlogRouter);
// Follow Routes
app.use("/follow", isAuth, FollowRouter)

app.listen(PORT, ()=>{
    console.log(clc.underline(`App is running at`))
    console.log(clc.yellow(`http://localhost:${PORT}`))
    // cleanUpBin();
})