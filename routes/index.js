const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const users = require('./modules/users')
const todos = require('./modules/todo')
const auth = require('./modules/auth')

const { authenticator } = require('../middleware/auth')

router.use('/todos', authenticator, todos)
router.use('/users', users)
router.use('/auth', auth)
router.use('/', authenticator, home)

module.exports = router 