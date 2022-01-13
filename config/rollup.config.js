const { babel } = require('@rollup/plugin-babel')
const fileSize = require('rollup-plugin-filesize')
const { terser } = require('rollup-plugin-terser')
const replace = require('@rollup/plugin-replace')
const progress = require('rollup-plugin-progress')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const packageJson = require('../package.json')

const version = packageJson.version

const getPlugins = (env) => {
  return [
    babel({
      babelHelpers: 'runtime',
      exclude: '**/node_modules/**'
    }),
    nodeResolve(),
    commonjs(),
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

const getOutputConfig = (fileName, env) => {
  return {
    file: `dist/${fileName}.js`,
    format: 'umd',
    name: 'klinecharts',
    sourcemap: env === 'development',
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
  // umd development all
  {
    input: 'src/index.js',
    output: getOutputConfig('klinecharts', 'development'),
    plugins: getPlugins('development')
  },

  // umd production all
  {
    input: 'src/index.js',
    output: getOutputConfig('klinecharts.min', 'production'),
    plugins: getPlugins('production')
  },

  // umd development blank
  {
    input: 'src/index.blank.js',
    output: getOutputConfig('klinecharts.blank', 'development'),
    plugins: getPlugins('development')
  },

  // umd production blank
  {
    input: 'src/index.blank.js',
    output: getOutputConfig('klinecharts.blank.min', 'production'),
    plugins: getPlugins('production')
  },

  // umd development simple
  {
    input: 'src/index.simple.js',
    output: getOutputConfig('klinecharts.simple', 'development'),
    plugins: getPlugins('development')
  },

  // umd production simple
  {
    input: 'src/index.simple.js',
    output: getOutputConfig('klinecharts.simple.min', 'production'),
    plugins: getPlugins('production')
  }
]
