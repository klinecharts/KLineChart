'use strict'
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/klinecharts.production.js')
} else {
  module.exports = require('./dist/klinecharts.development.js')
}
