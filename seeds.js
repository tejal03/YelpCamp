var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

var data = [
        {
            name:"Clouds",
            image:"http://media02.hongkiat.com/beautiful-clouds/Heart-From-Cloud.jpg",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        },
         {
            name:"Granite Hill",
            image:"https://upload.wikimedia.org/wikipedia/commons/9/9b/Miniature_Granite_Quarry%2C_Table_Hill_-_geograph.org.uk_-_252959.jpg",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        },
         {
            name:"Daisy Hill",
            image:"http://www.weekendnotes.com/images/p808039011.JPG",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        },
    ];
function seedDB(){
    //Remove all campgrounds
   Campground.remove({},function(err){
    if(err){
        console.log(err);
    }
    console.log("removed campgrounds!")
     data.forEach(function(seed){
         //add new campgrounds
         Campground.create(seed, function(err,camp){
             if(err){
                 console.log(err);
             }else{
                 console.log("added campground");
                 //create a comment
                 Comment.create({
                     text: "This place is great, but I wish there was internet",
                     author: "Homer"
                 },function(err,comment){
                     if(err){
                         console.log(err);
                     }else{
                         //add comment to campground
                         camp.comments.push(comment);
                        camp.save();
                        console.log("comment added");
                     }
                    
                 });
             }  
         }); 
    })   ;
    });
    
   
   
}

module.exports =seedDB;
