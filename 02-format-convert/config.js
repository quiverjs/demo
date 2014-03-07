'use strict'

var pathLib = require('path')

var staticDir = pathLib.join(__dirname, 'static')

module.exports = {
  dirPath: staticDir,
  imageDirPath: pathLib.join(staticDir, 'images'),
  postDirPath: pathLib.join(staticDir, 'markdown'),
  lessDirPath: pathLib.join(staticDir, 'less'),
  jsDirPath: pathLib.join(staticDir, 'js'),
  templatePath: pathLib.join(staticDir, 'template/main.html.template')
}