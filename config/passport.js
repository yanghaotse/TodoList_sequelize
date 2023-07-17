const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')

const User = db.User
module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())
  passport.use(new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
    User.findOne({where: {email} })
      .then( user => {
        if (!user) {
          return done(null, false, {message: 'That email is not register!'})
        }
        return bcrypt.compare(password, user.password).then(isMatch => {
          if(isMatch){
            return done(null, false, {message: 'Email or password incorrect.'})
          }
          return done(null, user)
        })
      })
      .catch(err => done(err, false))
  }))
// 序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then((user) => {
        user = user.toJSON()
        done(null, user)
      }).catch(err => done(err, null))
  })
}