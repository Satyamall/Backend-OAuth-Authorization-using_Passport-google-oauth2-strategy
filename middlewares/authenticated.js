
const jwt = require('jsonwebtoken');

const User = require("../models/user.model");

const verifyToken = (token)=>{
    return new Promise((resolve,reject)=>{
        jwt.verify(token, process.env.SECRET_KEY, (err,decoded)=>{
            if(err) return reject(err);

            return resolve(decoded);
        })
    })
}

const authenticated = async (req,res,next)=>{
     try{
        //  console.log(req.headers)

        // check if token is passed in header
        const bearer = req.headers.authorization;
        if(!bearer || !bearer.startsWith('Bearer ')){
            return res.status(400).json({ status: "failure", message: "No Token Present"})
        }

       const token = bearer.split('Bearer ')[1].trim();
       // verify token
       const decoded = await verifyToken(token);
       console.log(decoded);

       if(!decoded) return res.status(401).json({status: "failure", message: "Invalid Token"})

       // Check if user is in our database
       const user = await User.findById(decoded.id);
       if(!user) return res.status(401).json({status: "failure", message: "User does not exist"})

       req.user = user;
       next();
     }
     catch(err){
        res.status(500).json({status: "failure", message: err})
     }
}

module.exports = authenticated;