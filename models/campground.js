var mongoose = require('mongoose');

//Schema models
var campgroundSchema = new mongoose.Schema({
   name:String,
   image:String,
   description: String,
   comments: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: "Comment"
   }]
});

//make a model
module.exports = mongoose.model("Campground",campgroundSchema);