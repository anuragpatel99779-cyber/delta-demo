const dns = require("node:dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError.js");

// Routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { MongoStore } = require("connect-mongo");
const urldb=process.env.ATLASDB_URL;
const secret=process.env.SECRET;
// ================= MIDDLEWARE =================

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));


// ================= DATABASE =================

main()
    .then(() => {
        console.log("connected to db");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(urldb);
}


// ================= VIEW ENGINE =================

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));


// ================= ROUTES =================
const store = MongoStore.create({
    mongoUrl: urldb,

    crypto: {
        secret: process.env.SECRET
    },

    touchAfter: 24 * 3600
});

store.on("error", (err) => {
    console.error("Session store error:", err);
});

const sessionOptions = {
    secret: "mysecretcode",
    resave: false,
    saveUninitialized: true,

    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true
    }
};


app.use(session(sessionOptions));
// Listing routes
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
     res.locals.currentUser = req.user;
    next();
});
app.use("/listings", listingRouter);

// Review routes
app.use("/listings", reviewRouter);
app.use("/", userRouter);

// ================= 404 ERROR =================

app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});


// ================= ERROR HANDLING =================

app.use((err, req, res, next) => {

    let {
        statusCode = 500,
        message = "Something went wrong!"
    } = err;

    res.status(statusCode).render("listings/error.ejs", {
        err
    });

});


// ================= SERVER =================

app.listen(8080, () => {
    console.log("server is listening");
});