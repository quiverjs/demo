'use strict'

var fs = require('fs')
var mustache = require('mustache')
var streamConvert = require('quiver-stream-convert')

var templateRenderHandlerBuilder = function(config, callback) {
  var templatePath = config.templatePath

  fs.readFile(templatePath, 'utf-8', function(err, template) {
    if(err) return callback(err)
    
    mustache.parse(template)

    var handler = function(args, body, callback) {
      var templateArgs = {
        args: args,
        body: body
      }

      var result = mustache.render(template, templateArgs)

      callback(null, result)
    }

    callback(null, handler)
  })
}

var quiverComponents = [
  {
    name: 'demo template render handler',
    type: 'simple handler',
    inputType: 'text',
    outputType: 'text',
    resultContentType: 'text/html',
    configParam: [
      {
        key: 'templatePath',
        valueType: 'string',
        required: true
      }
    ],
    handlerBuilder: templateRenderHandlerBuilder
  }
]

module.exports = {
  quiverComponents: quiverComponents
}