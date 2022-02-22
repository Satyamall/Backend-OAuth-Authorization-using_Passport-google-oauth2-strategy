
const mongoose  = require("mongoose");

//Schema
const PostSchema= new mongoose.Schema({
   title: {type: String},
   author_id: {type: String}
   }
    ,
    { timestamps: true}
)

//Models
const Post = mongoose.model("posts",PostSchema);

module.exports=Post;