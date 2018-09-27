const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide your username']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email id'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide your password']
    }
})

UserSchema.pre('save', function(next){
    const user = this
    bcrypt.hash(user.password, 10, function(error, encrypt){
        user.password = encrypt
        next()
    })
})

const User = mongoose.model('User', UserSchema);

module.exports = User
