'use strict'

var streamConvert = require('quiver-stream-convert')

var userCacheFilter = function(config, handler, callback) {
  var caches = { }

  var filteredHandler = function(args, inputStreamable, callback) {
    var userId = args.user_id
    if(!userId) return handler(args, inputStreamable, callback)

    if(caches[userId]) return callback(null, caches[userId])

    handler(args, inputStreamable, function(err, resultStreamable) {
      if(err) return callback(err)

      // Make sure the stream is reusable
      streamConvert.createReusableStreamable(resultStreamable, 
        function(err, cachedStreamable) {
          if(err) return callback(err)

          caches[userId] = cachedStreamable
          callback(null, cachedStreamable)
        })
    })
  }

  callback(null, filteredHandler)
}

var quiverComponents = [
  {
    name: 'demo user cache filter',
    type: 'stream filter',
    filter: userCacheFilter
  }
]

module.exports = {
  quiverComponents: quiverComponents
}