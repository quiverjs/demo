'use strict'

var fs = require('fs')
var pathLib = require('path')
var browserify = require('browserify')
var configLib = require('quiver-config')
var copyObject = require('quiver-copy').copyObject
var streamConvert = require('quiver-stream-convert')

var browserifedFileHandlerBuilder = function(config, callback) {
  var handler = function(args, callback) {
    var sourcePath = args.filePath

    var b = browserify([sourcePath])
    b.bundle({}, callback)
  }

  callback(null, handler)
}

var browserifedFileHandleableBuilder = function(config, callback) {
  var fileHandleable = configLib.getHandleable(config,
    'quiver file directory handler')

  var handler = configLib.getStreamHandler(config, 
    'demo browserifed file stream handler')

  var handleable = copyObject(fileHandleable)
  handleable.toStreamHandler = function() {
    return handler
  }

  callback(null, handleable)
}

var quiverComponents = [
  {
    name: 'demo browserifed file stream handler',
    type: 'simple handler',
    inputType: 'void',
    outputType: 'text',
    resultContentType: 'application/javascript',
    middlewares: [
      'quiver file stats filter',
    ],
    handlerBuilder: browserifedFileHandlerBuilder
  },
  {
    name: 'demo browserifed file handler',
    type: 'handleable',
    handleables: [
      'quiver file directory handler',
      {
        handler: 'demo browserifed file stream handler',
        type: 'stream handler'
      }
    ],
    configAlias: {
      dirPath: 'jsDirPath'
    },
    handlerBuilder: browserifedFileHandleableBuilder
  }
]

module.exports = {
  quiverComponents: quiverComponents
}