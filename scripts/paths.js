'use strict';

const path = require('path');
const fs = require('fs');

const rootDirectory = fs.realpathSync(process.cwd());
const resolvePath = relativePath => path.resolve(rootDirectory, relativePath);

module.exports = {
  buildDir: resolvePath('dist'),
  index: resolvePath('src/index.ts'),
  context: resolvePath('src'),
  packageJson: resolvePath('package.json')
};
