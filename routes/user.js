
const express = require("express");
const router = express.Router();

const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const controller = require("../controler/user.js");

// ================= SIGNUP =================

router.route("/signup")
    .get(controller.renderSignupForm)
    .post(wrapAsync(controller.signup));

// ================= LOGIN =================

router.route("/login")
    .get(controller.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true
        }),
        controller.login
    );

// ================= LOGOUT =================

router.route("/logout")
    .get(controller.logout);

module.exports = router;
