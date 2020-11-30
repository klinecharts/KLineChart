const { babel } = require('@rollup/plugin-babel')
const fileSize = require('rollup-plugin-filesize')
const { terser } = require('rollup-plugin-terser')
const replace = require('@rollup/plugin-replace')
const progress = require('rollup-plugin-progress')
const packageJson = require('../package.json')

const inputPath = 'src/index.js'

const version = packageJson.version

const getPlugins = (env) => {
  return [
    babel({
      babelHelpers: 'bundled'
    }),
    progress(),
    fileSize(),
    replace({
      '__BUILD_ENV__': env,
      '__BUILD_VERSION__': version,
    }),
    env === 'production' && terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true
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
    indent: false,
    banner: `
/**
 * @license
 * KLineChart v${version}
 * Copyright (c) 2019 lihu.
 * Licensed under Apache License 2.0 https://www.apache.org/licenses/LICENSE-2.0
 */`.trim(),
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
