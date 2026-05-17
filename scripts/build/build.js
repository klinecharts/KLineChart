import { execFileSync } from 'node:child_process'
import { styleText } from 'node:util'
import { build as viteBuild } from 'vite'

import { createBuildConfig, version, env } from './config.js'

function checkInput (index) {
  if (index.endsWith('.ts')) {
    execFileSync('pnpm', ['code-lint'], { stdio: 'inherit' })
    execFileSync('pnpm', ['type-check'], { stdio: 'inherit' })
  }
}

async function build ({ index, replaceValues, fileName, format, parentDir, name }) {
  const text = `version ${version}${env ? ` ${env} ` : ' '}${format} file`

  console.log(`Start building ${text}...\n`)

  try {
    const startTime = new Date().getTime()
    checkInput(index)
    await viteBuild(createBuildConfig({
      input: index, replaceValues, fileName, format, name, parentDir
    }))

    console.log(styleText('green', `\n✔ Compiled ${text} successfully.\n`))
    console.log(`${styleText('green', '✔')} Done in ${((new Date().getTime() - startTime) / 1000 / 60).toFixed(2)}s.\n`)
  } catch (err) {
    console.log(`\n\n${styleText('red', String(err))}\n`)
    console.log(styleText('red', `✖️ Failed to compile ${text}.\n`))
    process.exit(1)
  }
}

export default build
