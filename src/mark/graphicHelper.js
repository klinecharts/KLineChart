/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
 * @param extendParallelLineCount
 * @returns {Array}
 */
export function getParallelLines (points, size, extendParallelLineCount = 0) {
  const lines = []
  if (points.length > 1) {
    if (points[0].x === points[1].x) {
      const startY = 0
      const endY = size.height
      lines.push([{ x: points[0].x, y: startY }, { x: points[0].x, y: endY }])
      if (points.length > 2) {
        lines.push([{ x: points[2].x, y: startY }, { x: points[2].x, y: endY }])
        if (extendParallelLineCount > 0) {
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
          if (extendParallelLineCount > 0) {
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
          if (extendParallelLineCount > 0) {
            const b2 = b + (b - b1)
            lines.push([{ x: startX, y: startX * k + b2 }, { x: endX, y: endX * k + b2 }])
          }
        }
      }
    }
  }
  return lines
}
