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
 * 测量文字的宽度
 * @param ctx
 * @param text
 * @returns {number}
 */
export function calcTextWidth (ctx, text) {
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
