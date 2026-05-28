import { rollup } from 'rollup'

import { createInputConfig, createOutputConfig, version, env } from './config.js'
import { failure, start, success } from './logger.js'

async function build ({ index, replaceValues, fileName, format, parentDir, name }) {
  const text = `klinecharts@${version} ${env ? `${env} ` : ''}${format.toUpperCase()} bundle`
  const startTime = Date.now()
  const outputOptions = createOutputConfig({
    fileName, format, name, parentDir
  })

  start(`Building ${text}...`)

  try {
    const bundle = await rollup(createInputConfig({ input: index, replaceValues }))

    await bundle.write(outputOptions)
    await bundle.close()

    success(`Built ${text}`, startTime)
  } catch (err) {
    failure(`Failed to build ${text}.`, err)
    process.exit(1)
  }
}

export default build
