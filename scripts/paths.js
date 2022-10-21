'use strict';

const path = require('path');
const fs = require('fs');

const rootDirectory = fs.realpathSync(process.cwd());
const resolvePath = relativePath => path.resolve(rootDirectory, relativePath);

module.exports = {
  build: resolvePath('dist'),
  index: resolvePath('src/index.ts'),
  packageJson: resolvePath('package.json')
};
