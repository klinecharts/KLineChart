const babel = require('rollup-plugin-babel')
const fileSize = require('rollup-plugin-filesize')
const { terser } = require('rollup-plugin-terser')
const replace = require('rollup-plugin-replace')
const packageJson = require('../package.json')

const inputPath = 'klinechart/index.js'

const getPlugins = (env) => {
  return [
    babel({
      exclude: 'node_modules/**'
    }),
    fileSize(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.K_LINE_VERSION': JSON.stringify(packageJson.version),
    }),
    env === 'production' && terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  ]
}

const getOutputConfig = (fileName) => {
  return {
    file: `dist/klinecharts.${fileName}.js`,
    format: 'umd',
    name: 'klinecharts',
    sourcemap: fileName === 'development',
    indent: false
  }
}

module.exports = [
  // umd development
  {
    input: inputPath,
    output: getOutputConfig('development'),
    plugins: getPlugins('development')
  },

  // umd production
  {
    input: inputPath,
    output: getOutputConfig('production.min'),
    plugins: getPlugins('production')
  }
]
