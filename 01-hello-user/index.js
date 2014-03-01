
'use strict'

var moduleLib = require('quiver-module')
var commandLib = require('quiver-command')

var quiverModule = moduleLib.exportFromManifestSync(require, './package.json')

module.exports = {
  quiverModule: quiverModule
}