
'use strict'

var helloHandlerBuilder = function(config, callback) {
  var defaultGreet = 'hello'

  var handler = function(args, text, callback) {
    var user = args.user
    var name = user.name
    var greet = user.greet || defaultGreet

    var wordCount = text.split(' ').length

    var greeting = greet + ', ' + name + '! You have submitted ' + wordCount + ' words.'
    callback(null, greeting)
  }

  callback(null, handler)
}

var quiverComponents = [
  {
    name: 'demo hello handler',
    type: 'simple handler',
    inputType: 'text',
    outputType: 'text',
    handlerBuilder: helloHandlerBuilder
  }
]

module.exports = {
  quiverComponents: quiverComponents
}