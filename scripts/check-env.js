import { styleText } from 'node:util'

const allowedPackageManager = 'pnpm'
const currentPackageManager = process.env.npm_config_user_agent?.split('/')[0] || 'unknown'
if (currentPackageManager !== allowedPackageManager) {
  console.log(styleText('red', `\nError: This project must use ${allowedPackageManager} as the package manager. The current package manager used is ${currentPackageManager}. Please use the command ${styleText('underline', `${allowedPackageManager} install`)} to install dependencies .\n`))
  process.exit(1)
}

function compareVersions (current, required) {
  const operator = required.match(/^[><=]+/)?.[0] || '>='
  const version = required.replace(/^[><=]+/, '')

  const currParts = current.replace(/^v/, '').split('.').map(Number)
  const reqParts = version.split('.').map(Number)

  for (let i = 0; i < 3; i++) {
    const curr = currParts[i] || 0
    const req = reqParts[i] || 0

    if (curr > req) return operator.includes('>')
    if (curr < req) return operator.includes('<')
  }

  return operator.includes('=')
}

const requiredNodeVersion = '>=22.0.0'
if (!compareVersions(process.version, requiredNodeVersion)) {
  console.log(styleText('red', `\nError: current Node.js version (${process.version}) does not meet the requirements, required Node.js version ${requiredNodeVersion} .\n`))
  process.exit(1)
}
