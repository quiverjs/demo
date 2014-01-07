
'use strict'

var helloHandlerBuilder = function(config, callback) {
  var defaultGreet = config.defaultGreet || 'hello'

  var handler = function(args, text, callback) {
    var user = args.user
    var name = user.name
    var greet = user.greet || defaultGreet

    var greeting = greet + ', <b>' + name + '</b>!\n' +
      'You have submitted the following text: ' + text
    
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
    middlewares: [
      'demo get user filter',
      'demo user permission filter',
      'demo escape html input filter',
      'demo uppercase greet filter'
    ],
    handlerBuilder: helloHandlerBuilder
  }
]

module.exports = {
  quiverComponents: quiverComponents
}