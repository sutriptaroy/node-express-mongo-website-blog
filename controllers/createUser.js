module.exports = (req, res) => {
    res.render('register', {
        errors: req.flash('errors'),
        data: req.flash('data')[0]
    })
}
