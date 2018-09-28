"use strict";
const bcrypt = require('bcrypt')
const User = require('../../database/models/User')

function redirectToRegisterPage(req,res,next){
    res.render('register', {
        errors: req.flash('errors'),
        data: req.flash('data')[0]
    });
}

function redirectToLoginPage(req,res,next){
    res.render('login');
}

function login(req,res,next){
    let {email, password} = req.body;
    User.findOne({email}, (error, user) => {
        if(user)
        {
            bcrypt.compare(password, user.password, (error, same) => {
                if(same)
                {
                    req.session.userId = user._id
                    res.redirect('/')
                }
                else
                {
                    res.redirect('/auth/login')
                }
            })
        }
        else
        {
            return res.redirect('/auth/register')
        }
    })
}

function register(req,res,next){
    User.create(req.body, (error, user) => {
        if(error)
        {
            const regErr = Object.keys(error.errors).map(key => error.errors[key].message)
            req.flash('errors',regErr)
            req.flash('data', req.body)
            return res.redirect('/auth/register')
        }
        res.redirect('/')
    })
}

function logout(req,res,next){
    req.session.destroy(() => {
        res.redirect('/')
    })
}


module.exports={redirectToRegisterPage,redirectToLoginPage,login,register,logout}