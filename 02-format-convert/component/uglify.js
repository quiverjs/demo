'use strict'

var uglify = require('uglify-js')

var uglifyHandler = function(args, inputText, callback) {
  var result = uglify.minify(inputText, {fromString: true})

  callback(null, result.code)
}

var quiverComponents = [
  {
    name: 'demo uglify convert handler',
    type: 'simple handler',
    inputType: 'text',
    outputType: 'text',
    resultContentType: 'application/javascript',
    handler: uglifyHandler
  }
]

module.exports = {
  quiverComponents: quiverComponents
}