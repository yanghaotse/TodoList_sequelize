const express = require('express')
const session = require('express-session')
const exhbs = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
// const bcrypt = require('bcryptjs')
const app = express()

const db = require('./models')

const usePassport = require('./config/passport') //載入passport設定檔，要寫在express-session之後
// const passport = require('passport')
const PORT = process.env.PORT || 3000


if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
const routes = require('./routes')
// const Todo = db.Todo
// const User = db.User

app.engine('hbs', exhbs({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

usePassport(app)

app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})




app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on http:localhost:${PORT}`)
})