'use strict';

const path = require('path');
const fs = require('fs');

const rootDirectory = fs.realpathSync(process.cwd());
const resolvePath = relativePath => path.resolve(rootDirectory, relativePath);

module.exports = {
  build: resolvePath('dist'),
  simpleIndexJs: resolvePath('src/index.simple.js'),
  blankIndexJs: resolvePath('src/index.blank.js'),
  fullIndexJs: resolvePath('src/index.js'),
  packageJson: resolvePath('package.json')
};
