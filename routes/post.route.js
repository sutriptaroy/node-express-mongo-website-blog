"use strict";
const express = require('express');
const router=express.Router();

const PostCtrl= require("../controllers/post/post.controller");

router.route("/new").get(PostCtrl.redirectToPostCreationPage);
router.route("/:id").get(PostCtrl.getPostById);
router.route("/store").post(PostCtrl.storePosts);

module.exports=router
