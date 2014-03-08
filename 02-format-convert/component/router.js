'use strict'

var quiverComponents = [
  {
    name: 'demo route list',
    type: 'route list',
    routeList: [
      {
        routeType: 'regex',
        regex: /^\/thumbnails(\/.+)$/,
        matchFields: ['path'],
        handler: 'demo image thumbnail handler'
      },
      {
        routeType: 'regex',
        regex: /^\/images(\/.+)$/,
        matchFields: ['path'],
        handler: 'demo static image handler'
      },
      {
        routeType: 'regex',
        regex: /^\/js(\/.+)$/,
        matchFields: ['path'],
        handler: 'demo javascript source file handler'
      },
      {
        routeType: 'regex',
        regex: /^\/css(\/.+)$/,
        matchFields: ['path'],
        handler: 'demo less css handler'
      },
      {
        routeType: 'regex',
        regex: /^\/post(\/.+)$/,
        matchFields: ['path'],
        handler: 'demo post page handler'
      },
      {
        routeType: 'regex',
        regex: /^\/static(\/.+)$/,
        matchFields: ['path'],
        handler: 'quiver file directory handler'
      }
    ]
  },
  {
    name: 'demo main router handler',
    type: 'router',
    routeLists: [
      'demo route list'
    ]
  }
]

module.exports = {
  quiverComponents: quiverComponents
}