// Using to render js files.

'use strict'
window.$ = window.jQuery = require('jquery')
var d3 = require("d3")
window.Bootstrap = require('bootstrap')
var canvasGauges = require('canvas-gauges')
var RadialGauge  = canvasGauges.RadialGauge
var Gauge = require('./js/lib/gauge.min.js').Gauge