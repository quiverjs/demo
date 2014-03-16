'use strict'

var helloHandler = function(args, callback) {
  callback(null, 'Hello World!')
}

var quiverComponents = [
  {
    name: 'demo hello handler',
    type: 'simple handler',
    inputType: 'void',
    outputType: 'text',
    handler: helloHandler
  }
]

module.exports = {
  quiverComponents: quiverComponents
}