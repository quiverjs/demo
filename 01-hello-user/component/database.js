
'use strict'

var Nedb = require('nedb')

var mockDatabaseMiddleware = function(config, handlerBuilder, callback) {
  var mockEntries = config.mockUserEntries
  if(!mockEntries) return callback(error(500, 'no mock user entries specified in config'))

  var db = new Nedb()

  db.insert(mockEntries, function(err) {
    if(err) return callback(err)

    config.database = db
    handlerBuilder(config, callback)
  })
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