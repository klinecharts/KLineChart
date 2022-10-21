'use strict';

const rollup = require('rollup');

const chalk = require('chalk');

const { inputConfig, outputConfig } = require('./config');

const env = process.env.NODE_ENV;

async function build() {
  console.log(`Creating an optimized ${chalk.blue(`${type} ${env}`)} build...\n`);
  const input = inputConfig(env);

  try {
    const bundle = await rollup.rollup(input);

    console.log('\n\nFile info: ');

    const output = outputConfig(env);

    await bundle.write(output);

    console.log(chalk.green(`\nCompiled ${type} ${env} successfully.\n`));
  } catch (err) {
    console.log(`\n\n${chalk.red(err)}\n`);
    console.log(chalk.red(`Failed to compile ${type} ${env}.\n`));
    process.exit(1);
  }
}

build();
