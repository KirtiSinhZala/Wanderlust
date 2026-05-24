require('dotenv').config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRoute = require("./routes/listingRoute.js");
const reviewRoute = require("./routes/reviewRoute.js");
const userRoute = require("./routes/userRoute.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
//Atlas be conect karta listings nai dekhay kem k tene strating ma mongodb sathe initilize karyu hatu have Atlas no use karyo 6

main().then(() => {
    console.log("connected to DB");
 })
    .catch((err) => {
        console.log(err);
     })

 async function main() {
    await mongoose.connect(MONGO_URL); 
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


    //session info long time sudhi store rakhva jethi user refresh kare toyr fari log in na karvu pade
    const store = MongoStore.create({
        mongoUrl : dbUrl,
        secret : process.env.SECRET,
        touchAfter : 24 * 3600  //server ma koi changes na kariye to session expire 14 days hoy chhe
    })

    store.on("error", (err)=> {
        console.log("error is ",err)

    })

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true, //cross scripting attacks ne prevent karva mate
    },
};



app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use(session(sessionOptions));
app.use(flash());

// Autnentication
app.use(passport.initialize());     //a middleware that initializes passport
app.use(passport.session());    //a web application needs to identyfy users as they browse from page to page.This series of requests and responses, each associated with the same user, is known as session
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
 res.locals.success = req.flash("success");
 res.locals.error = req.flash("error");
 console.log( res.locals.error);
 res.locals.currUser = req.user;
 next();
});

// app.get("/demouser", async(req,res) => {
//     let fakeUser = new User({
//         email : "student@gmail.com",
//         username : "delta101",
//     });

//    let registeredUser = await User.register(fakeUser,"hello");
//    res.send(registeredUser);
// })

app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);  //Parent route in terms of express router so without using mergeParams , child path(in review.js) can't access parent's parameters
app.use("/",userRoute);

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));  //for all unHandled routes
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "SomeThing Went Wrong" } = err;
    res.status(statusCode).render("error.ejs", { err });
    //  res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("server is listening on port number 8080");
});
