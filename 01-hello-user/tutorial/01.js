
'use strict'

var Nedb = require('nedb')
var mockUserEntries = require('./mock-user')

var createDatabase = function(callback) {
  var db = new Nedb()

  db.insert(mockUserEntries, function(err) {
    if(err) return callback(err)

    callback(null, db)
  })
}

var helloHandlerBuilder = function(config, callback) {
  createDatabase(function(err, db) {
    if(err) return callback(err)

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
  })
}

var quiverComponents = [
  {
    name: 'demo hello handler',
    type: 'simple handler',
    inputType: 'void',
    outputType: 'text',
    handlerBuilder: helloHandlerBuilder
  }
]

module.exports = {
  quiverComponents: quiverComponents
}