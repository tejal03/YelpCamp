var express                 = require("express"),
    app                     = express(),
    mongoose                = require('mongoose'),
    passport                = require('passport'),
    bodyParser              = require('body-parser'),
    LocalStrategy           = require('passport-local'),
    User                    = require('./models/user'),
    passportLocalMongoose   = require('passport-local-mongoose'),
    Campground          = require('./models/campground'),
    seedDB              = require('./seeds'),
    Comment             = require('./models/comment');

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
//******Local mongoDB connection***************
//mongoose.connect("mongodb://localhost/yelp_camp");
//*********mlab mongodb instance*****************
mongoose.connect("mongodb://scooby:scooby@ds041496.mlab.com:41496/yelp_camp");
app.use(express.static(__dirname + "/public"));

seedDB();

//PASSPORT CONFIGURATIONS
app.use(require("express-session")({
    secret: "Scooby is the best dog!",
    resave: false,
    saveUninitialized: false
}));


//setting passport
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
//********Reading the seaaion, taking data from session , encode/decode and putting it back******
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//User name will be empty if no one signed in
//or
//User details will be stored
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
})

// ==========  ROUTES ==========




//add a object in campground
// Campground.create( 
//     {
//         name:"Granite Hill",
//         image:"https://ap.rdcpix.com/1630497543/27d54fe90399ab2698302be764d0ec77l-m0xd-w1020_h770_q80.jpg",
//         description: "This is grate granite hill. No bathroom. No Water. Just beautiful granite! "
        
//     },function(error,campground){
//     if(error){
//         console.log(error);
//     }else{
//         console.log("Newly created campground.");
//         console.log(campground);
//     }
// });
/*
var camp =[
        
        {name:"Salmon Creek", image:"http://www.hikinginbigsur.com/hikepix/salmoncreekmain.jpg"},
        {name:"Granite Hill", image:"https://ap.rdcpix.com/1630497543/27d54fe90399ab2698302be764d0ec77l-m0xd-w1020_h770_q80.jpg"},
        {name:"Mountain", image:"https://www.w3schools.com/css/trolltunga.jpg"},
         {name:"Salmon Creek", image:"http://www.hikinginbigsur.com/hikepix/salmoncreekmain.jpg"},
        {name:"Granite Hill", image:"https://ap.rdcpix.com/1630497543/27d54fe90399ab2698302be764d0ec77l-m0xd-w1020_h770_q80.jpg"},
        {name:"Mountain", image:"https://www.w3schools.com/css/trolltunga.jpg"}
        
        ];*/
        
app.get("/",function(req,res){
   res.render('landing'); 
});

//Index route - to show all campgrounds
app.get("/campgrounds",function(req,res){
    
   // req.user; //contains all info regarding current loggedin user
   Campground.find({},function(err,allcampgrounds){
      if(err){
          console.log(err);
      } else{
        res.render('campgrounds/index',{camp:allcampgrounds});    
      }
   });
  // res.render('campground',{camp:camp}); 
});

//CREATE route - to create a new campground through web page
app.post("/campgrounds",function(req,res){
    var name=req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCamp = {name:name ,image:image, description:desc};
    
    //create a new campground and save it to database
    Campground.create(newCamp,function(error,campground){
    if(error){
        console.log(error);
    }else{
        console.log("Newly created campground.");
        //redirct back to campgrounds
        res.render('campgrounds/index');
        }
        
    });
   // camp.push(newCamp);
   // res.send("Post route");
   res.redirect('/campgrounds');
});

//NEW Route - to add the new campground into db

app.get('/campgrounds/new',function(req,res){
    res.render('campgrounds/new');
});

//SHOW route - shows more info about selected campground
app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
         if(err){
        console.log(err);
    }else{
        console.log(foundCampground);
        res.render('campgrounds/show',{campGround: foundCampground});
        }
    });
    
    
    
    //find the campground with requested id
    
   // res.render('show');
    //res.send("Show page in detail"); 
});

//=========================================
//           COMMENTS ROUTES
//=========================================

app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
    //find campground by id
    Campground.findById(req.params.id,function(err,foundCampground){
          if(err){
                console.log(err);
            }else{
               // console.log(foundCampground);
                res.render('comments/new',{campGround: foundCampground});
            }
    });

});

app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
   //lookup campground using Id
   //create a new comment
   //connect a new comment to campground
   //redirect to show page
   //res.send("Comment add page");
   
   Campground.findById(req.params.id,function(err,campground){
      if(err){
          console.log(err);
          res.redirect("/campgrounds");
      } else{
          console.log(req.body.comment);
          Comment.create(req.body.comment,function(err,comment){
              if(err){
                  console.log(err);
                  res.redirect("/campgrounds");
              } else{
                    campground.comments.push(comment);
                    campground.save();
                    console.log("New comment added");   
                    res.redirect("/campgrounds/"+campground._id);
                  }
      });
   }
});
});

//=================================================
//          Authentication Routes
//=================================================

//show sign up form
app.get("/register",function(req,res){
  res.render("register");
});

//handle signup logic
app.post("/register",function(req,res){
    var newUser =new User({username:   req.body.username});
    User.register(newUser, req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.render('register');
       } 
       //registers user with seralize method and "local" strategy
       passport.authenticate("local")(req,res,function(){
           //user loged in
          res.redirect('/campgrounds'); 
       });
    });
  
});


//show login form
app.get("/login", function(req,res){
   res.render("login"); 
});

//middleware - set it some code which runs before and final route callback here
//immediately runs after post "login" request
app.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect: "/login"
    }), function(req,res){
   
});

//Logout Route
app.get("/logout",function(req,res){
 req.logout();
 res.redirect("/");
});

//midddleware function
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
//Server started
app.listen(process.env.PORT, process.env.IP,function(){
    console.log("YelpCamp Server has started!!!");
});

