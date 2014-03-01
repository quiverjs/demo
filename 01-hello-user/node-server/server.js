
'use strict'

var Nedb = require('nedb')
var urlLib = require('url')
var httpLib = require('http')
var error = require('quiver-error').error
var mockUserEntries = require('../tutorial/mock-user')

var defaultGreet = 'Hello'
var serverPort = 8080

var createDatabase = function(callback) {
  var db = new Nedb()

  db.insert(mockUserEntries, function(err) {
    if(err) return callback(err)

    callback(null, db)
  })
}

var endResponse = function(statusCode, response) {
  response.writeHead(statusCode)
  response.end()
}

var nodeStreamToText = function(readStream, callback) {
  var stringBuffer = ''
  var streamEnded = false

  readStream.on('data', function(data) {
    stringBuffer += data
  })

  readStream.on('end', function() {
    if(streamEnded) return

    streamEnded = true
    callback(null, stringBuffer)
  })

  readStream.on('error', function(err) {
    if(streamEnded) return

    streamEnded = true
    callback(err)
  })
}

var tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
}

function replaceTag(tag) {
    return tagsToReplace[tag] || tag;
}

function htmlEscape(str) {
    return str.replace(/[&<>]/g, replaceTag);
}

createDatabase(function(err, db) {
  if(err) throw err

  var handler = function(request, response) {
    var path = urlLib.parse(request.url, true).pathname
    var userId = path.slice(1)

    db.findOne({ user_id: userId }, function(err, user) {
      if(err) return callback(err)

      if(user.is_banned) return endResponse(403, response)

      nodeStreamToText(request, function(err, inputText) {
        if(err) return endResponse(500, response)

        if(!user.is_admin) inputText = htmlEscape(inputText)

        var greet = user.greet || defaultGreet
        var greeting = greet + ', <b>' + user.name + '</b>!\n' +
          'You have submitted the following text: \n' + inputText

        if(user.want_uppercase_greet) greeting = greeting.toUpperCase()

        response.writeHead(200)
        response.write(greeting)
        response.end()
      })
    })
  }

  var server = httpLib.createServer(handler)
  server.listen(serverPort)
  console.log('listening to port ' + serverPort + '...')
})