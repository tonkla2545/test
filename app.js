require('dotenv').config()
require('./config/database').connect()

const express = require('express')
const User = require('./model/user')
const ejs = require('ejs')
const flash = require('connect-flash') //เก็บข้อความ error
const expressSession = require('express-session')


const indexRouter = require('./routers/index')
const usersRouter = require('./routers/user')
const productRouter = require('./routers/product')
const orderRouter = require('./routers/order')

const app = express()

app.use("*", (req,res,next)=>{
    loggedIn = ''
    next()
})

app.set('view engine','ejs')

app.use(express.static('public'))
app.use(express.json())
app.use(flash())
app.use(expressSession({
    secret: "node secret"
}))


app.use(indexRouter)
app.use(usersRouter)
app.use(productRouter)
app.use(orderRouter)

// login goes here




module.exports = app