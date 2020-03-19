/**
 * requestAnimationFrame兼容
 * @param fn
 */
export function requestAnimationFrame (fn) {
  if (!window.requestAnimationFrame) {
    return window.setTimeout(function () { fn() }, 1000 / 60)
  }
  return window.requestAnimationFrame(fn)
}

/**
 * cancelAnimationFrame兼容
 * @param id
 */
export function cancelAnimationFrame (id) {
  if (!window.cancelAnimationFrame) {
    clearTimeout(id)
  }
  window.cancelAnimationFrame(id)
}
