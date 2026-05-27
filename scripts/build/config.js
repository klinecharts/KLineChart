import replace from '@rollup/plugin-replace'

import { resolvePath, getVersion } from '../utils.js'

const version = getVersion()

// let commitId = ''
// try {
//   commitId = child_process.execSync(`git rev-parse --short v${version}^{}`).toString().trim()
// } catch {
// }

const env = process.env.NODE_ENV

const isDev = env === 'development'

const isProd = env === 'production'

const buildDir = resolvePath('dist')

const banner =
`
/**
 * @license
 * KLineChart v${version}
 * Copyright (c) 2019 lihu.
 * Licensed under Apache License 2.0 https://www.apache.org/licenses/LICENSE-2.0
 */`.trim()

function createBuildConfig ({
  input,
  replaceValues,
  fileName, format, name, parentDir
}) {
  let outDir
  if (parentDir) {
    outDir = resolvePath(parentDir, buildDir)
  } else {
    outDir = buildDir
  }

  return {
    configFile: false,
    envFile: false,
    keepProcessEnv: true,
    plugins: [
      replace({
        __VERSION__: version,
        ...replaceValues
      })
    ],
    build: {
      target: 'es2015',
      minify: isProd ? 'oxc' : false,
      emptyOutDir: false,
      outDir,
      sourcemap: isDev,
      lib: {
        entry: input,
        formats: [format],
        fileName: () => fileName,
        name
      },
      rolldownOptions: {
        external: format === 'cjs'
          ? ['./umd/klinecharts.min.js', './umd/klinecharts.js']
          : [],
        output: {
          comments: false,
          postBanner: banner
        }
      }
    }
  }
}

export {
  createBuildConfig,
  version,
  env,
  isDev,
  isProd
}
