
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
require("dotenv").config();
const passport = require('passport');
const { generateToken } = require('../controller/auth.controller');
const User = require('../models/user.model');

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback",
    passReqToCallback   : true
  },
  async function(request, accessToken, refreshToken, profile, cb) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    try{
        const user = await User.findOne({ email: profile?._json?.email });
        if(!user){
            const user = await User.create({
                email: profile?._json?.email,
                name: profile?.displayName,
                avatar: profile?._json?.picture,
                googleId: profile?.id,
                isGoogle: true
            })
            const token = generateToken(user);
            console.log(user);
            cb(null,user);
        }
        cb(null,user);
    }
    catch(err){
          cb(err,null)
    }
    // console.log(`accessToken: ${accessToken} 
    //   refreshToken: ${refreshToken}
    //   profile:`, profile)
    // cb(null,{});
  }
));

module.exports = passport;