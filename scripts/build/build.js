import { styleText } from 'node:util'
import { rollup } from 'rollup'

import { createInputConfig, createOutputConfig, version, env } from './config.js'

async function build ({ index, replaceValues, fileName, format, parentDir, name }) {
  const text = `version ${version}${env ? ` ${env} ` : ' '}${format} file`

  console.log(`Start building ${text}...\n`)

  try {
    const startTime = new Date().getTime()
    const bundle = await rollup(createInputConfig({ input: index, replaceValues }))

    await bundle.write(createOutputConfig({
      fileName, format, name, parentDir
    }))

    console.log(styleText('green', `\n✔ Compiled ${text} successfully.\n`))
    console.log(`${styleText('green', '✔')} Done in ${((new Date().getTime() - startTime) / 1000 / 60).toFixed(2)}s.\n`)
  } catch (err) {
    console.log(`\n\n${styleText('red', err)}\n`)
    console.log(styleText('red', `✖️ Failed to compile ${text}.\n`))
    process.exit(1)
  }
}

export default build
