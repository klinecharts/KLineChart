import { resolvePath } from '../utils.js'
import build from './build.js'
import { env, isDev } from './config.js'

const fileName = isDev ? 'klinecharts.js' : 'klinecharts.min.js'
const index = resolvePath('index.ts', resolvePath('src'))

await build({
  index,
  replaceValues: { 'process.env.NODE_ENV': JSON.stringify(env) },
  fileName,
  format: 'umd',
  parentDir: 'umd',
  name: 'klinecharts'
})
