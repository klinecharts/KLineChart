'use strict';

const { babel } = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const eslint = require('@rollup/plugin-eslint');
const replace = require('@rollup/plugin-replace');
const commonjs = require('@rollup/plugin-commonjs');
const { terser } = require('rollup-plugin-terser');
const typescript = require('rollup-plugin-typescript2')
const fileSize = require('rollup-plugin-filesize');
const progress = require('rollup-plugin-progress');
const requireContext = require('rollup-plugin-require-context');

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
  requireContext(),
  nodeResolve(),
  commonjs(),
  typescript(),
  progress(),
  replace({
    preventAssignment: true,
    values: {
      '__BUILD_ENV__': env,
      '__BUILD_VERSION__': version
    }
  }),
  fileSize(),
  env === 'production' && terser({
    compress: {
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true
    }
  })
];

function inputConfig (env) {
  return { input: paths.index, plugins: plugins(env) };
}

function outputConfig (env) {
  const isDevelopment = env === 'development';
  return {
    file: `${paths.build}/${isDevelopment ? 'klinecharts' : 'klinecharts.min'}.js`,
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
