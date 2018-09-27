// const http = require('http')
// const fs = require('fs')

// const home = fs.readFileSync('index.html')
// const about = fs.readFileSync('about.html')
// const error = fs.readFileSync('404.html')

// const server = http.createServer((req, res) => {
// 	if(req.url === "/")
// 	{
// 		return res.end(home)
// 	}
// 	else if(req.url === "/about")
// 	{
// 		return res.end(about)
// 	}
// 	else
// 	{
// 		res.writeHead(404)
// 		return res.end(error)
// 	}
// })

// server.listen(4000)

require('dotenv').config()
const express = require('express')
const expressEdge = require('express-edge')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const expressSession = require('express-session')
const connectMongo = require('connect-mongo')
const connectFlash = require('connect-flash')
const edge = require('edge.js')
const cloudinary = require('cloudinary')

const app = new express();

const createPostController = require('./controllers/createPost')
const homePageController = require('./controllers/homePage')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const createUserController = require('./controllers/createUser')
const storeUserController = require('./controllers/storeUser')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')
const logoutController = require('./controllers/logout')

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true })

app.use(connectFlash())

cloudinary.config({
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
	cloud_name: process.env.CLOUDINARY_NAME
})

const mongoStore = connectMongo(expressSession)

app.use(expressSession({
	secret: process.env.EXPRESS_SESSION_KEY,
	store: new mongoStore({
		mongooseConnection: mongoose.connection
	})
}))
app.use(fileUpload())
app.use(express.static('public'))
app.use(expressEdge);
app.set('views', `${__dirname}/views`)

app.use("*", (req, res, next) => {
	edge.global('auth', req.session.userId)
	next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

const storePost = require('./middleware/storePost')
const auth = require('./middleware/auth')
const checkAuth = require('./middleware/checkAuth')
// app.use('/posts/store', storePost);
// app.use('/posts/new', auth);

app.get('/', homePageController)
app.get('/post/new', auth, createPostController)
app.post('/posts/store', auth, storePost, storePostController)
app.get('/post/:id', getPostController)
app.get('/auth/register', checkAuth, createUserController)
app.post('/users/register', checkAuth, storeUserController)
app.get('/auth/login', checkAuth, loginController)
app.post('/users/login', checkAuth, loginUserController)
app.get('/auth/logout', auth, logoutController)

app.use((req, res) => res.render('not-found'))
 
app.listen(process.env.PORT, () => {
	console.log(`App Listening on Port ${process.env.PORT}`)
})
