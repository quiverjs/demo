
'use strict'

var error = require('quiver-error').error

var getUserHandlerBuilder = function(config, callback) {
  var database = config.database

  var handler = function(args, callback) {
    var userId = args.userId

    database.query('SELECT * FROM user WHERE user_id=$1;', [userId], function(err, rows) {
      if(err) return callback(err)
      if(rows.length == 0) return callback(error(404, 'user not found'))

      callback(null, rows[0])
    })
  }

  callback(null, handler)
}

var getUserFilterHandler = function(config, handler, callback) {
  var getUserHandler = config.quiverSimpleHandlers['demo get user handler']

  var filteredHandler = function(args, inputStreamable, callback) {
    getUserHandler({ userId: args.userId }, function(err, user) {
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
      'demo mock database middleware'
    ],
    handlerBuilder: getUserHandlerBuilder
  },
  {
    name: 'demo get user filter',
    type: 'stream filter',
    handleables: [
      {
        handler: 'demo get user handler',
        type: 'simple handler',
        inputType: 'void',
        outputType: 'json',
      }
    ],
    filter: getUserFilterHandler
  }
]

module.exports = {
  quiverComponents: quiverComponents
}