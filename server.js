

const express=require("express");
const app =express();
const cors= require('cors');
const connect = require('./config/db');
const passport = require('./config/passport');
const MongoStore = require('connect-mongo');
const session = require('express-session');

const authRouter = require('./routes/auth.router');
const userRouter = require('./routes/user.route');
const postRouter = require('./routes/post.router');

const PORT=5000;

//cors
app.use(cors());
app.use(express.json())

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        mongoUrl: "mongodb://localhost:27017/oauth"
    })
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user,done){
    done(null,user);
})

passport.deserializeUser(function(user,done){
    done(null,user);
})


app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);

const start= async ()=>{
    await connect();
    
    app.listen(PORT,()=>{
        console.log(`app is listening on port ${PORT}`);
    })
}

module.exports=start;