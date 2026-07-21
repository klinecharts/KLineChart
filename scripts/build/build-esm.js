import { resolvePath } from '../utils.js'
import build from './build.js'

const fileName = 'index.esm.js'
const index = resolvePath('index.ts', resolvePath('src'))

await build({
  index,
  fileName,
  format: 'esm'
})
