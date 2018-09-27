"use strict"

const path = require('path')
const Post = require('../../database/models/Post')
const cloudinary = require('cloudinary')

async function getPostById(req,res,next){
    let post = await Post.findById(req.params.id).populate('author')
    res.render('post', {
        post
    })
}

function storePosts(req,res,next){
    let {image} = req.files
    let uploadPath = path.resolve(__dirname, '..','../public/posts', image.name)
    image.mv(uploadPath, (error) => {
        cloudinary.v2.uploader.upload(uploadPath, (error, result) => {
            if(error)
            {
                return res.redirect('/')
            }
            Post.create({
                ...req.body,
                author: req.session.userId,
                image: `/posts/${image.name}`
            } , (error, post) => {
                res.redirect('/')
            })
        })
    })
}

function redirectToPostCreationPage(req,res,next){
    if(req.session.userId)
    {
        return res.render('create')
    }
    else{
        res.redirect('/auth/login')
    }
}

module.exports={getPostById,storePosts,redirectToPostCreationPage}