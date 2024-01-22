import build from './build.js'
import { isDev, env } from './config.js'
import { resolvePath } from './utils.js'

const fileName = isDev ? 'klinecharts.js' : 'klinecharts.min.js'
const index = resolvePath('index.ts', resolvePath('src'))

build({
  index,
  replaceValues: { "process.env.NODE_ENV": JSON.stringify(env) },
  fileName,
  format: 'umd',
  parentDir: 'umd',
  name: 'klinecharts'
})
