'use strict'

var lessLib = require('less')
var filterLib = require('quiver-filter')

var lessPathExtensionFilter = filterLib.argsFilter(
function(args, callback) {
  var path = args.path || ''
  args.path = path.replace('.css', '.less')
  
  callback(null, args)
})

var lessToCssConvertHandler = function(args, inputText, callback) {
  lessLib.render(inputText, callback)
}

var quiverComponents = [
  {
    name: 'demo less to css convert handler',
    type: 'simple handler',
    inputType: 'text',
    outputType: 'text',
    resultContentType: 'text/css',
    handler: lessToCssConvertHandler
  },
  {
    name: 'demo less path extension filter',
    type: 'stream filter',
    filter: lessPathExtensionFilter
  },
  {
    name: 'demo less css handler',
    type: 'stream pipeline',
    middlewares: [
      'demo less path extension filter',
      'quiver memory cache filter'
    ],
    pipeline: [
      'quiver file directory handler',
      'demo less to css convert handler'
    ],
    configAlias: {
      dirPath: 'lessDirPath'
    }
  }
]

module.exports = {
  quiverComponents: quiverComponents
}