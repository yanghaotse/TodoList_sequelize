const express = require('express')
const router = express.Router()

const db = require('../../models')
const Todo = db.Todo
const User = db.User

// 首頁
router.get('/', (req, res) => {
  User.findByPk(req.user.id)
    .then((user) => {
      if(!user) throw new Error('user not found')
      // .findAll()查詢多筆資料
      return Todo.findAll({
    // 多筆資料轉換成JS物件
        raw: true,
        nest: true,
        where: {UserId: req.user.id}
      })
    })

    .then((todos) => res.render('index', { todos: todos}) )
    .catch((error) =>console.log(error) )
})


module.exports = router