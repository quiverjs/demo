
'use strict'

var Nedb = require('nedb')
var mockUserEntries = require('./mock-user')

var getUserHandlerBuilder = function(config, callback) {
  var database = config.database

  var handler = function(args, callback) {
    var userId = args.user_id
    if(!userId) return callback(error(404, 'user not found'))

    database.findOne({ user_id: userId }, function(err, user) {
      if(err) return callback(err)
      if(!user) return callback(error(404, 'user not found'))

      callback(null, user)
    })
  }

  callback(null, handler)
}

var mockDatabaseMiddleware = function(config, handlerBuilder, callback) {
  var db = new Nedb()

  db.insert(mockUserEntries, function(err) {
    if(err) return callback(err)

    config.database = db
    handlerBuilder(config, callback)
  })
}

var helloHandlerBuilder = function(config, callback) {
  var getUserHandler = config.quiverSimpleHandlers['demo get user handler']

  var handler = function(args, callback) {
    var userId = args.user_id

    getUserHandler({ user_id: userId }, function(err, user) {
      if(err) return callback(err)

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
    handleables: [
      {
        handler: 'demo get user handler',
        type: 'simple handler',
        inputType: 'void',
        outputType: 'json',
      }
    ],
    handlerBuilder: helloHandlerBuilder
  },
  {
    name: 'demo mock database middleware',
    type: 'handleable middleware',
    middleware: mockDatabaseMiddleware
  },
  {
    name: 'demo get user handler',
    type: 'simple handler',
    inputType: 'void',
    outputType: 'json',
    middlewares: [
      'demo mock database middleware'
    ],
    handlerBuilder: getUserHandlerBuilder
  }
]

module.exports = {
  quiverComponents: quiverComponents
}