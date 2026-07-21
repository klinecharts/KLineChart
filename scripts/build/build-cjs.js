import { resolvePath } from '../utils.js'
import build from './build.js'

const fileName = 'index.cjs'
const index = resolvePath('index.js')
await build({
  index,
  fileName,
  format: 'cjs'
})
