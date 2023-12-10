import build from './build.js'
import { resolvePath } from './utils.js'

const fileName = 'index.js'
const index = resolvePath('index.ts', resolvePath('src'))

build({
  index,
  fileName,
  format: 'esm'
})