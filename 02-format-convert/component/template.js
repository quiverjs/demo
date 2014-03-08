'use strict'

var mustache = require('mustache')

var mustacheTemplateCompiler = function(templateText, callback) {
  mustache.parse(templateText)

  var compiledTemplate = function(args, callback) {
    var result = mustache.render(templateText, args)
    
    callback(null, result)
  }

  callback(null, compiledTemplate)
}

var quiverComponents = [
  {
    name: 'demo mustache template render handler',
    type: 'stream handler',
    configOverride: {
      templateCompiler: mustacheTemplateCompiler
    },
    resultContentType: 'text/html',
    handler: 'quiver template convert handler'
  }
]

module.exports = {
  quiverComponents: quiverComponents
}