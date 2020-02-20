const ctx = document.createElement('canvas').getContext('2d')
const pixelRatio = getPixelRatio(ctx)
ctx.scale(pixelRatio, pixelRatio)

/**
 * 获取屏幕比
 * @param ctx
 * @returns {number}
 */
export function getPixelRatio (ctx) {
  const backingStore = ctx.backingStorePixelRatio ||
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio || 1
  return (window.devicePixelRatio || 1) / backingStore
}

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

/**
 * 测量文字的宽度
 * @param fontSize
 * @param text
 * @returns {number}
 */
export function calcTextWidth (fontSize, text) {
  ctx.font = getFont(fontSize)
  return ctx.measureText(text).width
}

/**
 * 获取字体
 * @param fontSize
 * @returns {string}
 */
export function getFont (fontSize) {
  return `${fontSize}px Arial`
}
