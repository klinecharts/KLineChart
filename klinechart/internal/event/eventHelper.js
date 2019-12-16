/**
 * 是否是有效事件
 * @param point
 * @param viewPortHandler
 * @returns {boolean}
 */
export function isValidEvent (point, viewPortHandler) {
  return !(point.x < viewPortHandler.contentLeft() ||
    point.x > viewPortHandler.contentRight() ||
    point.y < viewPortHandler.contentTop() ||
    point.y > viewPortHandler.contentBottom())
}

/**
 * 获取事件对应画布上的点
 * @param e
 * @param canvasDom
 * @returns {{x: number, y: number}}
 */
export function getCanvasPoint (e, canvasDom) {
  const rect = canvasDom.getBoundingClientRect()
  const x = Math.round(e.clientX - rect.left)
  const y = Math.round(e.clientY - rect.top)
  return { x: x, y: y }
}

/**
 * 阻止事件
 * @param e
 */
export function stopEvent (e) {
  if (e && e.stopPropagation) {
    e.stopPropagation()
  } else {
    window.event.cancelBubble = true
  }
  if (e && e.preventDefault) {
    e.preventDefault()
  } else {
    window.event.returnValue = false
  }
}

/**
 * 两点之间的距离
 * @param eventX
 * @param startX
 * @param eventY
 * @param startY
 * @returns {*}
 */
export function distance (eventX, startX, eventY, startY) {
  const dx = eventX - startX
  const dy = eventY - startY
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * 计算移动距离
 * @param e
 * @param canvasDom
 * @returns {number}
 */
export function spacing (e, canvasDom) {
  if (e.targetTouches.length < 2) {
    return 0
  }
  const point1 = getCanvasPoint(e.targetTouches[0], canvasDom)
  const point2 = getCanvasPoint(e.targetTouches[1], canvasDom)
  const x = Math.abs(point1.x - point2.x)
  const y = Math.abs(point1.y - point2.y)
  return Math.sqrt(x * x + y * y)
}

/**
 * 获取两点间x的距离
 * @param e
 * @param canvasDom
 * @returns {number}
 */
export function getXDist (e, canvasDom) {
  const point1 = getCanvasPoint(e.targetTouches[0], canvasDom)
  const point2 = getCanvasPoint(e.targetTouches[1], canvasDom)
  return Math.abs(point1.x - point2.y)
}
