const path = require('path')
const Post = require('../../database/models/Post')
const cloudinary = require('cloudinary')

module.exports = async (req, res) => {
    const {image} = req.files
    const uploadPath = path.resolve(__dirname, '..','public/posts', image.name)
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
