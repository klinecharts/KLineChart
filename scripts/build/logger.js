import { styleText } from 'node:util'

function formatDuration (startTime) {
  return `${((Date.now() - startTime) / 1000).toFixed(2)}s`
}

function start (message) {
  console.log(styleText('cyan', message))
}

function success (message, startTime) {
  console.log(styleText('green', `${message} in ${formatDuration(startTime)}`))
  console.log()
}

function failure (message, error) {
  console.log()
  console.log(styleText('red', error?.stack ?? error?.message ?? error))
  console.log(styleText('red', message))
  console.log()
}

export {
  start,
  success,
  failure,
  formatDuration
}
