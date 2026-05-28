import fs from 'fs'
import { styleText } from 'node:util'

import { resolvePath } from '../utils.js'
import { start, success } from './logger.js'

const buildDir = resolvePath('dist')

let totalFileCount = 0
let deletedFileCount = 0

function eachFiles (dir) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir)
    files.forEach(file => {
      const path = resolvePath(file, dir)
      if (fs.statSync(path).isDirectory()) {
        eachFiles(path)
      } else {
        totalFileCount++
      }
    })
  }
}

function deleteFiles (dir) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir)
    files.forEach(file => {
      const path = resolvePath(file, dir)
      if (fs.statSync(path).isDirectory()) {
        deleteFiles(path)
      } else {
        fs.unlinkSync(path)
        deletedFileCount++
        if (process.stdout.isTTY) {
          process.stdout.clearLine(process.stdout)
          process.stdout.cursorTo(0)
          const percent = `${Math.round(deletedFileCount / totalFileCount * 100)}%`
          process.stdout.write(`${styleText('blue', `${percent}(${deletedFileCount}/${totalFileCount}): ${file}`)}`, 'utf-8')
        }
      }
    })
    fs.rmdirSync(dir)
  }
}

function clean () {
  const startTime = Date.now()

  start('Cleaning build output...', [
    `target: ${buildDir}`
  ])

  if (!fs.existsSync(buildDir)) {
    success('No build output to clean', startTime, [
      'deleted: 0 files'
    ])
    return
  }

  eachFiles(buildDir)
  deleteFiles(buildDir)

  success('Cleaned build output', startTime, [
    `deleted: ${deletedFileCount} files`
  ])
}

clean()
