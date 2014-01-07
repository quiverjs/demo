
'use strict'

var error = require('quiver-error').error

var userPermissionFilter = function(config, handler, callback) {
  var filteredHandler = function(args, inputStreamable, callback) {
    var user = args.user

    if(user.is_banned) return callback(error(403, 'you are banned!'))
    handler(args, inputStreamable, callback)
  }

  callback(null, filteredHandler)
}

var quiverComponents = [
  {
    name: 'demo user permission filter',
    type: 'stream filter',
    middlewares: [
      'demo user filter'
    ],
    filter: userPermissionFilter
  }
]

module.exports = {
  quiverComponents: quiverComponents
}