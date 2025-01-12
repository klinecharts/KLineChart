import childProcess from 'child_process'
import chalk from 'chalk'

import { getVersion } from './utils.js'

try {
  const versions = childProcess.execSync('npm view klinecharts versions').toString().trim()
  const currentVersion = getVersion()
  if (versions.includes(getVersion())) {
    console.log(chalk.red(`✖️ The version ${chalk.underline(currentVersion)} already exists, please modify the version in package.json`))
    process.exit(1)
  }
} catch (error) {}
