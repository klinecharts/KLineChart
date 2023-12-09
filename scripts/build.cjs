'use strict';

const rollup = require('rollup');

const chalk = require('chalk');

const { inputConfig, outputConfig } = require('./config.cjs');

const env = process.env.NODE_ENV;

async function build() {
  const fileName = env === 'development' ? 'klinecharts.js' : 'klinecharts.min.js'
  console.log(`Creating an optimized ${chalk.blue(`${fileName}`)} build...\n`);
  const input = inputConfig(env);

  try {
    const startTime = new Date().getTime()
    const bundle = await rollup.rollup(input);
    
    const output = outputConfig(env, fileName);
    await bundle.write(output);

    console.log(chalk.green(`\n✔️ Compiled ${fileName} successfully.\n`));
    console.log(`Done in ${((new Date().getTime() - startTime) / 1000 / 60).toFixed(2)}s.\n`)
  } catch (err) {
    console.log(`\n\n${chalk.red(err)}\n`);
    console.log(chalk.red(`✖️ Failed to compile ${fileName}.\n`));
    process.exit(1);
  }
}

build();
