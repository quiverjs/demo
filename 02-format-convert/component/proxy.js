'use strict'

var subrequestLib = require('quiver-subrequest')

var proxyHandlerBuilder = function(config, callback) {
  var proxyHost = config.proxyHost
  var proxyPort = config.proxyPort

  var handler = function(args, inputStream, callback) {
    var path = args.path || '/'
     
    var requestHead = {
      host: proxyHost,
      port: proxyPort,
      method: 'POST',
      path: path
    }

    subrequestLib.subrequestToStream(requestHead, inputStream, callback)
  }

  callback(null, handler)
}

var quiverComponents = [
  {
    name: 'demo proxy handler',
    type: 'simple handler',
    inputType: 'stream',
    outputType: 'stream',
    configParam: [
      {
        key: 'proxyHost',
        valueType: 'string',
        required: true
      },
      {
        key: 'proxyPort',
        valueType: 'number',
        required: true
      }
    ],
    handlerBuilder: proxyHandlerBuilder
  },
  {
    name: 'demo proxied image thumbnail handler',
    type: 'stream pipeline',
    middlewares: [
      'quiver memory cache filter'
    ],
    pipeline: [
      'quiver file directory handler',
      'demo proxy handler'
    ],
    configAlias: {
      dirPath: 'imageDirPath'
    }
  },
]

module.exports = {
  quiverComponents: quiverComponents
}