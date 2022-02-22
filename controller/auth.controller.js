
const User = require('../models/user.model')
const jwt = require("jsonwebtoken");

require('dotenv').config()

const generateToken = (user)=>{
    // synchronous function
    return jwt.sign({
        id: user._id,
        email: user.email
    },
    process.env.SECRET_KEY,
    { expiresIn: "1h"}
    )
}


const signup = async (req,res)=>{
    try{
        const user = await User.create(req.body)
        const token = generateToken(user);
        res.status(201).json({status: "success", data: {
            id: user._id,
            email: user.email,
            token
        }})

    }
    catch(err){
        res.status(400).json({ status: "failure", message: err})
    }
}

const signin = async (req,res)=>{
    // if user exists in our database
    let user;
    try{
          user = await User.findOne({email: req.body.email});

          if(!user) return res.status(401).json({ status: "failure", message: "Invalid email or password"})
    }
    catch(err){
       return res.status(500).json({status: "failure", message: err})
    }
    
    // check if password is correct or not
    try{
        const isMatch = await user.comparePassword(req.body.password);
        if(!isMatch) return res.status(401).json({status: "failure", message: "No User found"})
    }
    catch(err){
        return res.status(500).json({ status: "failure", message: err}) 
    }

    //generate token
    const token = generateToken(user);
    // console.log(token,user)
    return res.status(200).json({status: "success", data: {
        id: user._id,
        email: user.email,
        token
    }})

}

module.exports = {
    signup,
    signin,
    generateToken
}