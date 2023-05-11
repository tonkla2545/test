require('dotenv').config()
require('./config/database').connect()

const express = require('express')
const app = express()
const User = require('./model/user')
const ejs = require('ejs')
const mongoose = require('mongoose')
const flash = require('connect-flash') //เก็บข้อความ error
const expressSession = require('express-session')


global.loggedIn = null

const indexRouter = require('./routers/index')
const usersRouter = require('./routers/user')
const productRouter = require('./routers/product')
const orderRouter = require('./routers/order')


app.set('view engine','ejs')

// app.use(session({
//     secret: 'your-secret-key',
//     resave: false,
//     saveUninitialized: false
// }));
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded()) // รับข้อมูลจาก HTML form เป็น JSON
app.use(flash())
app.use(expressSession({
    secret: "node secret"
}))

app.use("*", (req,res,next)=>{
    loggedIn = req.session.userId
    next()
})


app.use(indexRouter)
app.use(usersRouter)
app.use(productRouter)
app.use(orderRouter)

// login goes here




module.exports = app