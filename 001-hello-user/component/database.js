
'use strict'

var mockEntries = {
  john: {
    name: 'John Smith',
    greet: 'bonjour'
  },
  joker: {
    name: 'Mr Joker',
    want_uppercase_greet: true
  },
  troll: {
    name: 'Anonymous Troll',
    is_banned: true
  },
  admin: {
    name: 'Administrator',
    is_admin: true
  }
}

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
  config.database = mockDatabase

  handlerBuilder(config, callback)
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