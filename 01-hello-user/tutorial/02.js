
'use strict'

var Nedb = require('nedb')
var mockUserEntries = require('./mock-user')

var mockDatabaseMiddleware = function(config, handlerBuilder, callback) {
  var db = new Nedb()

  db.insert(mockUserEntries, function(err) {
    if(err) return callback(err)

    config.database = db
    handlerBuilder(config, callback)
  })
}

var helloHandlerBuilder = function(config, callback) {
  var db = config.database

  var handler = function(args, callback) {
    var userId = args.user_id

    db.findOne({ user_id: userId }, function(err, user) {
      if(err) return callback(err)
      if(!user) return callback(error(404, 'user not found'))

      var greeting = 'hello, ' + user.name
      callback(null, greeting)
    })
  }

  callback(null, handler)
}

var quiverComponents = [
  {
    name: 'demo hello handler',
    type: 'simple handler',
    inputType: 'void',
    outputType: 'text',
    middlewares: [
      'demo mock database middleware'
    ],
    handlerBuilder: helloHandlerBuilder
  },
  {
    name: 'demo mock database middleware',
    type: 'handleable middleware',
    middleware: mockDatabaseMiddleware
  } 
]

module.exports = {
  quiverComponents: quiverComponents
}