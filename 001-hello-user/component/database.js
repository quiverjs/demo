
'use strict'

var Nedb = require('nedb')

var mockEntries = [
  {
    user_id: 'john',
    name: 'John Smith',
    greet: 'bonjour'
  },
  {
    user_id: 'joker',
    name: 'Mr Joker',
    want_uppercase_greet: true
  },
  {
    user_id: 'troll',
    name: 'Anonymous Troll',
    is_banned: true
  },
  {
    user_id: 'admin',
    name: 'Administrator',
    is_admin: true
  }
]

var mockQuery = function(query, params, callback) {
  var userId = params[0]
  var user = mockEntries[userId]

  var rows = user ? [user] : []
  callback(null, rows)
}

var mockDatabase = {
  query: mockQuery
}

var mockDatabaseMiddleware = function(config, handlerBuilder, callback) {
  var db = new Nedb()
  db.insert(mockEntries, function(err) {
    if(err) return callback(err)

    config.database = db
    handlerBuilder(config, callback)
  })
}

var quiverComponents = [
  {
    name: 'demo mock database middleware',
    type: 'handleable middleware',
    middleware: mockDatabaseMiddleware
  }
]

module.exports = {
  quiverComponents: quiverComponents
}