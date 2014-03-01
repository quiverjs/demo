
'use strict'

var http = require('http')
http.globalAgent.maxSockets = 10000

var pipeStream = require('quiver-pipe-stream').pipeStream
var streamChannel = require('quiver-stream-channel')

var helloHandlerBuilder = function(config, callback) {
  var defaultGreet = config.defaultGreet || 'hello'

  var handler = function(args, inputStream, callback) {
    var user = args.user
    var name = user.name
    var greet = user.greet || defaultGreet

    var greeting = greet + ', <b>' + name + '</b>!\n' +
      'You have submitted the following text: \n'

    var channel = streamChannel.createStreamChannel()
    var writeStream = channel.writeStream

    writeStream.write(greeting)
    pipeStream(inputStream, writeStream)

    callback(null, channel.readStream)
  }

  callback(null, handler)
}

var quiverComponents = [
  {
    name: 'demo hello handler',
    type: 'simple handler',
    inputType: 'stream',
    outputType: 'stream',
    middlewares: [
      'demo user filter',
      'demo user permission filter',
      'demo escape html input filter',
      'demo uppercase greet filter'
    ],
    handlerBuilder: helloHandlerBuilder
  }
]

module.exports = {
  quiverComponents: quiverComponents
}