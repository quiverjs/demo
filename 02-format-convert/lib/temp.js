'use strict'

var pathLib = require('path')

var createTempPathBuilder = function(extension) {
  return function(callback) {
    var random = (Math.random()*10000)|0
    var tempId = '' + (new Date()).getTime() + '-' + random + '.' + extension
    var path = pathLib.join(__dirname, '../temp', tempId)
    callback(null, path)
  }
}

var tempPathBuilder = createTempPathBuilder('tmp')
var pdfTempPathBuilder = createTempPathBuilder('pdf')

module.exports = {
  tempPathBuilder: tempPathBuilder,
  pdfTempPathBuilder: pdfTempPathBuilder,
  createTempPathBuilder: createTempPathBuilder
}