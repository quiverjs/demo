
'use strict'

var streamChannel = require('quiver-stream-channel')

var tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
}

function replaceTag(tag) {
    return tagsToReplace[tag] || tag;
}

function htmlEscape(str) {
    return str.replace(/[&<>]/g, replaceTag);
}

var escapeHtmlHandlerBuilder = function(config, callback) {
  var handler = function(args, inputStream, callback) {
    var channel = streamChannel.createStreamChannel()
    var writeStream = channel.writeStream

    var doPipe = function() {
      inputStream.read(function(streamClosed, data) {
        if(streamClosed) return writeStream.closeWrite(streamClosed.err)

        // Assume string in ASCII encoding
        var escaped = htmlEscape(data.toString())

        writeStream.write(escaped)
        doPipe()
      })
    }

    doPipe()
    callback(null, channel.readStream)
  }

  callback(null, handler)
}

var escapeHtmlInputFilter = function(config, handler, callback) {
  var escapeHandler = config.quiverStreamHandlers['demo escape html handler']

  var filteredHandler = function(args, inputStreamable, callback) {
    var user = args.user
    if(user.is_admin) return handler(args, inputStreamable, callback)

    escapeHandler({}, inputStreamable, function(err, transformedStreamable) {
      if(err) return callback(err)

      handler(args, transformedStreamable, callback)
    })
  }

  callback(null, filteredHandler)
}

var quiverComponents = [
  {
    name: 'demo escape html handler',
    type: 'simple handler',
    inputType: 'stream',
    outputType: 'stream',
    handlerBuilder: escapeHtmlHandlerBuilder
  },
  {
    name: 'demo escape html input filter',
    type: 'stream filter',
    handleables: [
      {
        handler: 'demo escape html handler',
        type: 'stream handler'
      }
    ],
    middleware: [
      'demo user filter'
    ],
    filter: escapeHtmlInputFilter
  }
]

module.exports = {
  quiverComponents: quiverComponents
}