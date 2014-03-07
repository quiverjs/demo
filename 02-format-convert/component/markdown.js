'use strict'

var marked = require('marked')
var streamConvert = require('quiver-stream-convert')

var markdownConvertHandler = function(args, inputText, callback) {
  var result = marked(inputText)
  
  callback(null, result)
}

var quiverComponents = [
  {
    name: 'demo markdown convert handler',
    type: 'simple handler',
    inputType: 'text',
    outputType: 'text',
    resultContentType: 'application/javascript',
    handler: markdownConvertHandler
  },
  {
    name: 'demo markdown page handler',
    type: 'stream pipeline',
    middlewares: [
      'quiver memory cache filter'
    ],
    pipeline: [
      'quiver file directory handler',
      'demo markdown convert handler'
    ],
    configAlias: {
      dirPath: 'postDirPath'
    }
  }
]

module.exports = {
  quiverComponents: quiverComponents
}