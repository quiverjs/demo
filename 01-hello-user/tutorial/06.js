
'use strict'

var Nedb = require('nedb')
var error = require('quiver-error').error
var mockUserEntries = require('./mock-user')
var streamChannel = require('quiver-stream-channel')

var userPermissionFilter = function(config, handler, callback) {
  var filteredHandler = function(args, inputStreamable, callback) {
    var user = args.user

    if(user.is_banned) return callback(error(403, 'you are banned!'))
    handler(args, inputStreamable, callback)
  }

  callback(null, filteredHandler)
}

var toUppercaseHandlerBuilder = function(config, callback) {
  var handler = function(args, inputStream, callback) {
    var channel = streamChannel.createStreamChannel()
    var writeStream = channel.writeStream

    var doPipe = function() {
      inputStream.read(function(streamClosed, data) {
        if(streamClosed) return writeStream.closeWrite(streamClosed.err)

        // Assume string in ASCII encoding
        writeStream.write(data.toString().toUpperCase())
        doPipe()
      })
    }

    doPipe()
    callback(null, channel.readStream)
  }

  callback(null, handler)
}

var uppercaseGreetFilter = function(config, handler, callback) {
  var toUppercaseHandler = config.quiverStreamHandlers['demo to uppercase handler']

  var filteredHandler = function(args, inputStreamable, callback) {
    var user = args.user

    if(!user.want_uppercase_greet) return handler(args, inputStreamable, callback)

    handler(args, inputStreamable, function(err, resultStreamable) {
      if(err) return callback(err)

      toUppercaseHandler({}, resultStreamable, callback)
    })
  }

  callback(null, filteredHandler)
}

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

    var greeting = 'hello, ' + user.name

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
      'demo user filter',
      'demo user permission filter',
      'demo uppercase greet filter'
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
  },
  {
    name: 'demo user permission filter',
    type: 'stream filter',
    middlewares: [
      'demo user filter'
    ],
    filter: userPermissionFilter
  },
  {
    name: 'demo to uppercase handler',
    type: 'simple handler',
    inputType: 'stream',
    outputType: 'stream',
    handlerBuilder: toUppercaseHandlerBuilder
  },
  {
    name: 'demo uppercase greet filter',
    type: 'stream filter',
    handleables: [
      {
        handler: 'demo to uppercase handler',
        type: 'stream handler'
      }
    ],
    middleware: [
      'demo user filter'
    ],
    filter: uppercaseGreetFilter
  }
]

module.exports = {
  quiverComponents: quiverComponents
}