"use strict";
const express = require('express');
const router=express.Router();

const AuthCtrl= require("../controllers/auth/auth.controller");

router.route("/register-page").get(AuthCtrl.redirectToRegisterPage);
router.route("/login-page").get(AuthCtrl.redirectToLoginPage);
router.route("/register").post(AuthCtrl.register);
router.route("/login").post(AuthCtrl.login);
router.route("/logout").get(AuthCtrl.logout);



module.exports=router


//app.get('/auth/register', checkAuth, createUserController)
// app.post('/users/register', checkAuth, storeUserController)
// app.get('/auth/login', checkAuth, loginController)
// app.post('/users/login', checkAuth, loginUserController)
// app.get('/auth/logout', auth, logoutController)