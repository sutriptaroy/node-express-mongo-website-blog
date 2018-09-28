
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

// const MongoClient=require("mongodb").MongoClient

// MongoClient.connect("mongodb://127.0.0.1:27017", function (err, client) {
// 	if(err){
// 		console.log(err);
// 	}
// 	else{
// 		console.log("Connected successfully to server");
// 		const mongo = client.db("menapp");			
// 	}	
//   });
  
mongoose.connect(process.env.DB_URL,{ useNewUrlParser: true }).then((res)=>{
	console.log("Mongo Database Connected")
},(err)=>{
	console.log(err);
})

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
      url: 'mongodb://127.0.0.1:27017/menapp',
      autoRemove: 'interval',
      autoRemoveInterval: 10 // In minutes. Default
	}),
	resave:true,
	saveUninitialized: true
}));


// app.use(expressSession({
// 	secret: process.env.EXPRESS_SESSION_KEY,
// 	store: new mongoStore({
// 		mongooseConnection:new  MongoClient,
		
// 	}),
// 	resave:true,
// 	saveUninitialized: true
// }))

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


const postRoutes=require('./routes/post.route')
const authRoutes=require('./routes/auth.route')

app.use('/auth',authRoutes);
app.use('/',postRoutes);
app.use('/post',postRoutes);

//app.use((req, res) => res.render('index','Path Not Found'))
 
app.listen(process.env.PORT, () => {
	console.log(`App Listening on Port ${process.env.PORT}`)
})
