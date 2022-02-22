

const mongoose  = require("mongoose");
const bcrypt = require('bcrypt');

//Schema
const UserSchema= new mongoose.Schema({
    email: {type: String, required: true,unique: true},
    password: {type: String},
    googleId: {type: String},
    isGoogle: {type: Boolean},
    name: {type: String},
    avatar: {type: String},
    roles: [{type: String}]
   }
    ,
    { timestamps: true}
)

UserSchema.pre('save', function(next){
    if(!this.isModified('password')) return next();
    if(!this.password) return next();
    bcrypt.hash(this.password, 0, (err,hash)=>{
         if(err) return next(err);

         this.password = hash;
         next()
    })
})

UserSchema.methods.comparePassword = function(password){

    const hashedPassword = this.password;
    return bcrypt.compare(password, hashedPassword);
}
//Models
const User= mongoose.model("users",UserSchema);

module.exports=User;