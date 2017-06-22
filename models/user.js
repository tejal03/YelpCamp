var mongoose                = require('mongoose'),
    passportLocalMongoose   = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});
//add passport-local-mongoose methods to user schema
UserSchema.plugin(passportLocalMongoose);
module.exports =mongoose.model("User", UserSchema);