const express = require('express')
const exhbs = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const bcrypt = require('bcryptjs')
const app = express()
const PORT = 3000
const db = require('./models')
const session = require('express-session')
const usePassport = require('./config/passport') //載入passport設定檔，要寫在express-session之後
const passport = require('passport')

const Todo = db.Todo
const User = db.User

app.engine('hbs', exhbs({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')

app.use(session({
  secret: 'ThisIsMySecret',
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


// 待移到auth.js
app.post('/users/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))




// 首頁
app.get('/', (req, res) => {
  // User.findByPk(req.user.id)
  // .findAll()查詢多筆資料
  return Todo.findAll({
    // 多筆資料轉換成JS物件
    raw: true,
    nest: true
  })
  .then((todos) => { return res.render('index', { todos: todos}) })
  .catch((error) => { return res.status(422).json(error) })
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
  const errors = []
  
  if(!name || !email || !passport || !confirmPassword){
    errors.push({ message: '所有欄位都是必填'})
  }
  if(password !== confirmPassword){
    errors.push({ message: '密碼與確認密碼不相符'})
  }
  if(errors.length){
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }

  User.findOne({ where: { email} }).then(user => { //用條件查詢一筆資料
    if(user){
      errors.push({ message: '這個 Email 已經註冊過了'})
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then( user => res.redirect('/'))
      .catch(error => console.log(error))
  })
})

// 登出頁面
app.get('/users/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')

})

// detail頁面
app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id) // 用id查詢一筆資料
    .then((todo) => res.render('detail', {todo: todo.toJSON()}))
    .catch(error => console.log(error))  
})



app.listen(PORT, () => {
  console.log(`App is running on http:localhost:${PORT}`)
})