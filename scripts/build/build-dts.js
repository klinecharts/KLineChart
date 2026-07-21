import { execFile } from 'node:child_process'
import { createRequire } from 'node:module'
import { promisify } from 'node:util'

import { version } from './config.js'
import { failure, start, success } from './logger.js'

const execFileAsync = promisify(execFile)
const require = createRequire(import.meta.url)
const dtsBundleGenerator = require.resolve('dts-bundle-generator/dist/bin/dts-bundle-generator.js')
const startTime = Date.now()
const output = 'dist/index.d.ts'

start(`Building klinecharts@${version} declaration bundle...`)

try {
  const { stdout, stderr } = await execFileAsync(process.execPath, [dtsBundleGenerator, '--no-banner', 'true', '--fail-on-class', 'true', '--umd-module-name', 'klinecharts', '-o', output, 'src/index.ts'])

  const outputLines = stdout
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('Done in '))

  if (outputLines.length > 0) {
    console.log(outputLines.join('\n'))
  }
  if (stderr.trim()) {
    console.log(stderr.trim())
  }

  success('Built declaration bundle', startTime)
} catch (err) {
  failure('Failed to build declaration bundle.', err)
  process.exit(1)
}
