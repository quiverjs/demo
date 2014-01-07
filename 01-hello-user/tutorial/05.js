
'use strict'

var Nedb = require('nedb')
var error = require('quiver-error').error
var mockUserEntries = require('./mock-user')

var getUserFilter = function(config, handler, callback) {
  var getUserHandler = config.quiverSimpleHandlers['demo get user handler']

  var filteredHandler = function(args, inputStreamable, callback) {
    var userId = args.user_id
    if(!userId && args.path) userId = args.path.slice(1)

    getUserHandler({ user_id: userId }, function(err, user) {
      if(err) return callback(err)

      args.user = user
      handler(args, inputStreamable, callback)
    })
  }

  callback(null, filteredHandler)
}

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
  var handler = function(args, callback) {
    var user = args.user
    var greet = user.greet || 'hello'

    if(user.is_banned) return callback(error(403, 'you are banned!'))

    var greeting = greet + ', ' + user.name

    if(user.want_uppercase_greet) greeting = greeting.toUpperCase()

    callback(null, greeting)
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
      'demo user filter'
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
  },
  {
    name: 'demo user filter',
    type: 'stream filter',
    handleables: [
      {
        handler: 'demo get user handler',
        type: 'simple handler',
        inputType: 'void',
        outputType: 'json',
      }
    ],
    filter: getUserFilter
  }
]

module.exports = {
  quiverComponents: quiverComponents
}