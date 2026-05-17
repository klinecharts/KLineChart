import { parse } from '@babel/parser'
import generator from '@babel/generator'

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

const generate = generator.default

const banner = `
    /**
     * @license
     * KLineChart v${version}
     * Copyright (c) 2019 lihu.
     * Licensed under Apache License 2.0 https://www.apache.org/licenses/LICENSE-2.0
     */`.trim()

function createReplacePlugin (replaceValues = {}) {
  const values = {
    // '__VERSION__': `v${version}(${commitId.length > 0 ? `${commitId}, ` : ''}${new Date().toISOString()})`,
    __VERSION__: version,
    ...replaceValues
  }

  return {
    name: 'klinecharts-replace',
    enforce: 'pre',
    transform (code) {
      let result = code
      Object.keys(values).forEach(key => {
        result = result.replaceAll(key, values[key])
      })
      return result === code
        ? null
        : {
            code: result,
            map: { mappings: '' }
          }
    }
  }
}

function createBannerPlugin () {
  return {
    name: 'klinecharts-banner',
    generateBundle (_, bundle) {
      Object.values(bundle).forEach(file => {
        if (file.type === 'chunk') {
          file.code = `${banner}\n${file.code}`
        }
      })
    }
  }
}

function createStripCommentsPlugin () {
  return {
    name: 'klinecharts-strip-comments',
    renderChunk (code) {
      const ast = parse(code, {
        sourceType: 'unambiguous'
      })
      const result = generate(ast, {
        comments: false,
        compact: false,
        minified: false
      })
      return {
        code: result.code,
        map: { mappings: '' }
      }
    }
  }
}

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

  const rollupFormat = format === 'esm' ? 'es' : format

  return {
    configFile: false,
    envFile: false,
    keepProcessEnv: true,
    plugins: [
      createReplacePlugin(replaceValues),
      createStripCommentsPlugin(),
      createBannerPlugin()
    ],
    build: {
      emptyOutDir: false,
      minify: isProd ? 'terser' : false,
      outDir,
      sourcemap: isDev,
      lib: {
        entry: input,
        formats: [rollupFormat],
        fileName: () => fileName,
        name
      },
      rollupOptions: {
        external: format === 'cjs'
          ? ['./umd/klinecharts.min.js', './umd/klinecharts.js']
          : []
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
