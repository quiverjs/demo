'use strict'

var $ = require('jquery')

$(function() {
  console.log('page loaded')

  $('#shapes')
    .append('<div class="shape" id="shape1">')
    .append('<div class="shape" id="shape2">')
    .append('<div class="shape" id="shape3">')
})