'use strict';

const { babel } = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const eslint = require('@rollup/plugin-eslint');
const replace = require('@rollup/plugin-replace');
const commonjs = require('@rollup/plugin-commonjs');
const { terser } = require('rollup-plugin-terser');
const fileSize = require('rollup-plugin-filesize');
const progress = require('rollup-plugin-progress');
const paths = require('./paths');

const packageJson = require(paths.packageJson);

const version = packageJson.version;

const plugins = (env) => [
  eslint({
    throwOnError: true
  }),
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
];

function inputConfig (type, env) {
  const inputPath = () => {
    switch (type) {
      case 'simple': return paths.simpleIndexJs;
      case 'blank': return paths.blankIndexJs;
      default: return paths.fullIndexJs;
    }
  }
  return { input: inputPath(), plugins: plugins(env) };
}

function outputConfig (type, env) {
  const isDevelopment = env === 'development';
  const fileName = () => {
    switch (type) {
      case 'simple': return isDevelopment ? 'klinecharts.simple' : 'klinecharts.simple.min';
      case 'blank': return isDevelopment ? 'klinecharts.blank' : 'klinecharts.blank.min';
      default: return isDevelopment ? 'klinecharts' : 'klinecharts.min';
    }
  }
  return {
    file: `${paths.build}/${fileName()}.js`,
    format: 'umd',
    name: 'klinecharts',
    sourcemap: isDevelopment,
    indent: false,
    banner: `
/**
 * @license
 * KLineChart v${version}
 * Copyright (c) 2019 lihu.
 * Licensed under Apache License 2.0 https://www.apache.org/licenses/LICENSE-2.0
 */`.trim(),
  };
}

module.exports = { 
  inputConfig,
  outputConfig
};
