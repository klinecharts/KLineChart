import build from './build.js'
import { resolvePath } from './utils.js'

const fileName = 'index.cjs'
const index = resolvePath('index.js')
build({
  index,
  fileName,
  format: 'cjs'
})
