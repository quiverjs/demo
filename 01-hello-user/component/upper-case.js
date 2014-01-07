
'use strict'

var streamChannel = require('quiver-stream-channel')

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

var quiverComponents = [
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