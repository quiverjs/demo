'use strict'

var quiverComponents = [
  {
    name: 'demo javascript source file handler',
    type: 'stream pipeline',
    middlewares: [
      'quiver memory cache filter'
    ],
    pipeline: [
      'demo browserifed file handler',
      'demo uglify convert handler'
    ]
  }
]

module.exports = {
  quiverComponents: quiverComponents
}