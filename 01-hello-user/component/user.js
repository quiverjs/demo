
'use strict'

var error = require('quiver-error').error

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

var quiverComponents = [
  {
    name: 'demo get user handler',
    type: 'simple handler',
    inputType: 'void',
    outputType: 'json',
    middlewares: [
      'demo mock database middleware',
      //'demo user cache filter'
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