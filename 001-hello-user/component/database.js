
'use strict'

var mockEntries = {
  johnsmith: {
    name: 'John Smith',
    greet: 'bonjour'
  },
  joker: {
    name: 'Mr Joker',
    want_uppercase_greet: true
  },
  troll: {
    name: 'Anonymous Troll',
    banned: true
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
    type: 'middleware',
    middleware: mockDatabaseMiddleware
  }
]

module.exports = {
  quiverComponents: quiverComponents
}