
'use strict'

var moduleLib = require('quiver-module')

var quiverModule = moduleLib.exportFromManifestSync(require, './package.json')

module.exports = {
  quiverModule: quiverModule
}