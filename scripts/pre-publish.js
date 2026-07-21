import { styleText } from 'node:util'
import childProcess from 'child_process'

import { getVersion } from './utils.js'

function logError(message) {
  console.log(styleText('red', `✖️ ${message}`))
}

try {
  const currentVersion = getVersion()
  const versions = JSON.parse(childProcess.execSync('npm view klinecharts versions --json', { timeout: 30000 }).toString().trim())

  if (versions.includes(currentVersion)) {
    logError(`The version ${styleText('underline', currentVersion)} already exists, please modify the version in package.json`)
    process.exit(1)
  }
} catch (_error) {
  logError('Unable to verify package version from npm registry, please check the network and try again')
  process.exit(1)
}
