'use strict'

var pathLib = require('path')
var tempPathBuilder = require('../lib/temp').tempPathBuilder

var imageResizeCommandArgsExtractor = function(args, inputPath, outputPath, callback) {
  var size = args.size || 250

  var commandArgs = ['convert', inputPath, '-resize', size, outputPath]
  callback(null, commandArgs)
}

var quiverComponents = [
  {
    name: 'demo resize image handler',
    type: 'stream handler',
    configOverride: {
      commandArgsExtractor: imageResizeCommandArgsExtractor,
      inputTempPathBuilder: tempPathBuilder,
      outputTempPathBuilder: tempPathBuilder,
    },
    resultContentType: 'image/jpeg',
    handler: 'quiver file convert command handler'
  },
  {
    name: 'demo image thumbnail handler',
    type: 'stream pipeline',
    middlewares: [
    
      'quiver memory cache filter'
    ],
    pipeline: [
      'quiver file directory handler',
      'demo resize image handler'
    ],
    configAlias: {
      dirPath: 'imageDirPath'
    }
  },
  {
    name: 'demo static image handler',
    type: 'stream handler',
    configAlias: {
      dirPath: 'imageDirPath'
    },
    handler: 'quiver file directory handler'
  }
]

module.exports = {
  quiverComponents: quiverComponents
}