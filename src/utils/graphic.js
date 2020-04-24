/**
 * Copyright (c) 2019 lihu
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * 获取某点在两点决定的一次函数上的y值
 * @param point1
 * @param point2
 * @param targetPoints
 */
export function getLinearY (point1, point2, targetPoints) {
  const v = []
  if (point1 && point2 && targetPoints.length > 0) {
    const subX = (point1.x - point2.x)
    if (subX === 0) {
      targetPoints.forEach(point => {
        v.push(point.y)
      })
    } else {
      const k = (point1.y - point2.y) / subX
      const b = point1.y - k * point1.x
      targetPoints.forEach(point => {
        v.push(point.x * k + b)
      })
    }
  }
  return v
}

/**
 * 点是否在线上
 * @param point1
 * @param point2
 * @param targetPoint
 */
export function checkPointOnStraightLine (point1, point2, targetPoint) {
  if (!targetPoint || !point1 || !point2) {
    return false
  }
  if (point1.x === point2.x) {
    return Math.abs(targetPoint.x - point1.x) < 1
  }
  if (point1.y === point2.y) {
    return Math.abs(targetPoint.y - point1.y) < 1
  }
  return Math.abs(targetPoint.y - getLinearY(point1, point2, [targetPoint])[0]) < 1
}

/**
 * 点是否在线段上
 * @param point1
 * @param point2
 * @param targetPoint
 * @returns {boolean}
 */
export function checkPointOnRayLine (point1, point2, targetPoint) {
  if (!targetPoint || !point1 || !point2) {
    return false
  }
  if (checkPointOnStraightLine(point1, point2, targetPoint)) {
    if (point1.x === point2.x) {
      if (point1.y < point2.y) {
        return targetPoint.y > point1.y - 2
      } else {
        return targetPoint.y < point1.y + 2
      }
    }
    if (point1.x < point2.x) {
      return targetPoint.x > point1.x - 2
    } else {
      return targetPoint.x < point1.x + 2
    }
  }
  return false
}

/**
 * 判断点是否在线段上面
 * @param point1
 * @param point2
 * @param targetPoint
 */
export function checkPointOnSegmentLine (point1, point2, targetPoint) {
  if (!targetPoint || !point1 || !point2) {
    return false
  }
  if (checkPointOnStraightLine(point1, point2, targetPoint)) {
    const a = Math.sqrt(Math.pow(targetPoint.x - point1.x, 2) + Math.pow(targetPoint.y - point1.y, 2))
    const b = Math.sqrt(Math.pow(targetPoint.x - point2.x, 2) + Math.pow(targetPoint.y - point2.y, 2))
    const c = Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2))
    return Math.abs(a + b - c) < 2
  }
  return false
}

/**
 * 点是否在圆上
 * @param circleCenterPoint
 * @param radius
 * @param targetPoint
 * @returns {boolean}
 */
export function checkPointOnCircle (circleCenterPoint, radius, targetPoint) {
  if (!targetPoint) {
    return false
  }
  const subX = targetPoint.x - circleCenterPoint.x
  const subY = targetPoint.y - circleCenterPoint.y
  return !(subX * subX + subY * subY > radius * radius)
}

/**
 * 获取平行线
 * @param points
 * @param size
 * @param isPriceChannelLine
 * @returns {Array}
 */
export function getParallelLines (points, size, isPriceChannelLine) {
  const lines = []
  if (points.length > 1) {
    if (points[0].x === points[1].x) {
      const startY = 0
      const endY = size.height
      lines.push([{ x: points[0].x, y: startY }, { x: points[0].x, y: endY }])
      if (points.length > 2) {
        lines.push([{ x: points[2].x, y: startY }, { x: points[2].x, y: endY }])
        if (isPriceChannelLine) {
          const distance = points[0].x - points[2].x
          lines.push([{ x: points[0].x + distance, y: startY }, { x: points[0].x + distance, y: endY }])
        }
      }
    } else {
      const startX = 0
      const endX = size.width
      if (points[0].y === points[1].y) {
        lines.push([{ x: startX, y: points[0].y }, { x: endX, y: points[0].y }])
        if (points.length > 2) {
          lines.push([{ x: startX, y: points[2].y }, { x: endX, y: points[2].y }])
          if (isPriceChannelLine) {
            const distance = points[0].y - points[2].y
            lines.push([{ x: startX, y: points[0].y + distance }, { x: endX, y: points[0].y + distance }])
          }
        }
      } else {
        const k = (points[0].y - points[1].y) / (points[0].x - points[1].x)
        const b = points[0].y - k * points[0].x
        lines.push([{ x: startX, y: startX * k + b }, { x: endX, y: endX * k + b }])
        if (points.length > 2) {
          const b1 = points[2].y - k * points[2].x
          lines.push([{ x: startX, y: startX * k + b1 }, { x: endX, y: endX * k + b1 }])
          if (isPriceChannelLine) {
            const b2 = b + (b - b1)
            lines.push([{ x: startX, y: startX * k + b2 }, { x: endX, y: endX * k + b2 }])
          }
        }
      }
    }
  }
  return lines
}

/**
 * 获取斐波那契线
 * @param points
 * @param size
 */
export function getFibonacciLines (points, size) {
  const lines = []
  if (points.length > 0) {
    const startX = 0
    const endX = size.width
    lines.push([{ x: startX, y: points[0].y }, { x: endX, y: points[0].y }])
    if (points.length > 1) {
      const yDistance = points[0].y - points[1].y
      lines.push([{ x: startX, y: points[1].y + yDistance * 0.786 }, { x: endX, y: points[1].y + yDistance * 0.786 }])
      lines.push([{ x: startX, y: points[1].y + yDistance * 0.618 }, { x: endX, y: points[1].y + yDistance * 0.618 }])
      lines.push([{ x: startX, y: points[1].y + yDistance * 0.5 }, { x: endX, y: points[1].y + yDistance * 0.5 }])
      lines.push([{ x: startX, y: points[1].y + yDistance * 0.382 }, { x: endX, y: points[1].y + yDistance * 0.382 }])
      lines.push([{ x: startX, y: points[1].y + yDistance * 0.236 }, { x: endX, y: points[1].y + yDistance * 0.236 }])
      lines.push([{ x: startX, y: points[1].y }, { x: endX, y: points[1].y }])
    }
  }
  return lines
}
