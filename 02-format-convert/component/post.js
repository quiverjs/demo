'use strict'

var filterLib = require('quiver-filter')

var markdownPathExtensionFilter = filterLib.argsFilter(
function(args, callback) {
  var path = args.path || ''
  args.path = path + '.md'

  callback(null, args)
})

var quiverComponents = [
  {
    name: 'demo markdown path extension filter',
    type: 'stream filter',
    filter: markdownPathExtensionFilter
  },
  {
    name: 'demo post page handler',
    type: 'stream pipeline',
    middlewares: [
      'demo markdown path extension filter',
      'quiver memory cache filter'
    ],
    pipeline: [
      'quiver file directory handler',
      'demo markdown convert handler',
      'demo mustache template render handler'
    ],
    configAlias: {
      dirPath: 'postDirPath'
    }
  }
]

module.exports = {
  quiverComponents: quiverComponents
}