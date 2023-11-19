'use strict';
const fs = require('fs');
const chalk = require('chalk');

const { resolvePath, buildDir } = require('./paths.cjs');

let totalFileCount = 0
let deletedFileCount = 0

function eachFiles (dir) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const path = resolvePath(file, dir);
      if (fs.statSync(path).isDirectory()) {
        eachFiles(path);
      } else {
        totalFileCount++
      }
    })
  }
}

function deleteFiles (dir) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const path = resolvePath(file, dir);
      if (fs.statSync(path).isDirectory()) {
        deleteDir(path);
      } else {
        fs.unlinkSync(path);
        deletedFileCount++
        process.stdout.clearLine(process.stdout);
        process.stdout.cursorTo(0);
        const percent = `${Math.round(deletedFileCount / totalFileCount * 100)}%`;
        process.stdout.write(`${chalk.blue(`${percent}(${deletedFileCount}/${totalFileCount}): ${file}`)}`, 'utf-8');
      }
    })
    fs.rmdirSync(dir);
  }
}

function clean () {
  eachFiles(buildDir);
  deleteFiles(buildDir);

  console.log(chalk.green('\n\nClean successfully.\n'));
}

clean();
