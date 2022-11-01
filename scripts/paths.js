'use strict';

const path = require('path');
const fs = require('fs');

const rootDirectory = fs.realpathSync(process.cwd());
const resolvePath = relativePath => path.resolve(rootDirectory, relativePath);

module.exports = {
  buildDeclaration: resolvePath('types/index.d.ts'),
  declarationIndex: resolvePath('src/typings.d.ts'),
  buildCore: resolvePath('dist'),
  coreIndex: resolvePath('src/index.ts'),
  context: resolvePath('src'),
  packageJson: resolvePath('package.json')
};
