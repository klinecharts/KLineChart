import { styleText } from 'node:util'
import semver from 'semver'

const requiredNodeVersion = '>=22.0.0'

if (!semver.satisfies(process.version, requiredNodeVersion)) {
  console.log(styleText('red', `\nError: current Node.js version (${process.version}) does not meet the requirements, required Node.js version ${requiredNodeVersion} .\n`))
  process.exit(1)
}
