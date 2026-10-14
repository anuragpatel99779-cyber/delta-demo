const User = require("../models/user.js");

// ================= SIGNUP FORM =================
module.exports.renderSignupForm = (req, res) => {
    res.render("user/signup.ejs");
};

// ================= SIGNUP =================
module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const newUser = new User({
            username,
            email
        });

        const registeredUser = await User.register(
            newUser,
            password
        );

        // Automatically login after signup
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }

            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// ================= LOGIN FORM =================
module.exports.renderLoginForm = (req, res) => {
    res.render("user/login.ejs");
};

// ================= LOGIN =================
module.exports.login = (req, res) => {
    req.flash("success", "Welcome back to WanderLust!");

    const redirectUrl = res.locals.redirectUrl || "/listings";

    res.redirect(redirectUrl);
};

// ================= LOGOUT =================
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "Logged you out!");
        res.redirect("/listings");
    });
};