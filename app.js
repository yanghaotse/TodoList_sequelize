const express = require('express')
const exhbs = require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')
const app = express()
const PORT = 3000
const db = require('./models')

const Todo = db.Todo
const User = db.User

app.engine('hbs', exhbs({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

// 首頁
app.get('/', (req, res) => {
  res.send('hello world')
})

// 登入頁面
app.get('/users/login', (req, res) => {
  res.render('login')
})

// 登入送出
app.post('/users/login', (req, res) => {
  res.send('login')
})

// 註冊頁面
app.get('/users/register', (req, res) => {
  res.render('register')
})

// 註冊送出
app.post('/users/register', (req, res) => {
  const {name, email, password, confirmPassword} = req.body
  User.create({
    name,
    email,
    password
  })
  .then( user => res.redirect('/'))
})

// 登出頁面
app.get('users/logout', (req, res) => {
  res.send('logout')
})


app.listen(PORT, () => {
  console.log(`App is running on http:localhost:${PORT}`)
})