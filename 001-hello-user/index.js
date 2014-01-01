
'use strict'

var moduleLib = require('quiver-module').enterContext(require)

var quiverModule = moduleLib.exportFromManifest('./package.json')

module.exports = {
  quiverModule: quiverModule
}