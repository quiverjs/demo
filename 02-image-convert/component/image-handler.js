'use strict'

var pathLib = require('path')

var imageResizeCommandArgsExtractor = function(args, inputPath, outputPath, callback) {
  var size = args.size || 200

  var commandArgs = ['convert', inputPath, '-resize', size, outputPath]
  callback(null, commandArgs)
}

var tempPathBuilder = function(callback) {
  var tempId = '' + (new Date()).getTime() + '.tmp'
  var path = pathLib.join(__dirname, '../temp', tempId)
  callback(null, path)
}

var quiverComponents = [
  {
    name: 'demo resize image handler',
    type: 'stream handler',
    configOverride: {
      commandArgsExtractor: imageResizeCommandArgsExtractor,
      inputTempPathBuilder: tempPathBuilder,
      outputTempPathBuilder: tempPathBuilder,
      resultContentType: 'image/jpeg'
    },
    handler: 'quiver file convert command handler'
  },
  {
    name: 'demo image gallery handler',
    type: 'stream pipeline',
    middlewares: [
      'quiver memory cache filter'
    ],
    pipeline: [
      'quiver file directory handler',
      'demo resize image handler'
    ]
  }
]

module.exports = {
  quiverComponents: quiverComponents
}