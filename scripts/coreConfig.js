'use strict';

const { babel } = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const eslint = require('@rollup/plugin-eslint');
const replace = require('@rollup/plugin-replace');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const terser = require('@rollup/plugin-terser');
const fileSize = require('rollup-plugin-filesize');
const progress = require('rollup-plugin-progress');

const paths = require('./paths');

const packageJson = require(paths.packageJson);

const version = packageJson.version;

const plugins = (env) => [
  typescript(),
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
  replace({
    preventAssignment: true,
    values: {
      '__BUILD_ENV__': env,
      '__BUILD_VERSION__': version
    }
  }),
  fileSize(),
  env === 'production' && terser()
];

function inputConfig (env) {
  return { input: paths.coreIndex, plugins: plugins(env) };
}

function outputConfig (env) {
  const isDevelopment = env === 'development';
  return {
    file: `${paths.buildCore}/${isDevelopment ? 'klinecharts' : 'klinecharts.min'}.js`,
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
