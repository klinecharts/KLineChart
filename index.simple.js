'use strict'
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/klinecharts.simple.min.js')
} else {
  module.exports = require('./dist/klinecharts.simple.js')
}
