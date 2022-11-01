'use strict';

const { entries } = require('./declarationConfig')

const { generateDtsBundle } = require('dts-bundle-generator');

function build () {
  console.log(generateDtsBundle(entries))
}

build();
