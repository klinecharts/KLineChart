
import path from 'path'
import fs from 'fs'

const root = fs.realpathSync(process.cwd())
const resolvePath = (relativePath, rootDirectory = root) => path.resolve(rootDirectory, relativePath)

function getVersion () {
  const result = fs.readFileSync(resolvePath('package.json'), 'utf-8')
  return JSON.parse(result).version
}

export { resolvePath, getVersion }
