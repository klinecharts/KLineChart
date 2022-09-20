'use strict';

const path = require('path');
const fs = require('fs');

const rootDirectory = fs.realpathSync(process.cwd());
const resolvePath = relativePath => path.resolve(rootDirectory, relativePath);

module.exports = {
  build: resolvePath('dist'),
  simpleIndexJs: resolvePath('src/index.simple.ts'),
  blankIndexJs: resolvePath('src/index.blank.ts'),
  fullIndexJs: resolvePath('src/index.ts'),
  packageJson: resolvePath('package.json')
};
