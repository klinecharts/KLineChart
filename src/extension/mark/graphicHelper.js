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

export const DEVIATION = 2

/**
 * 获取两点之间的距离
 * @param point1
 * @param point2
 * @return {number}
 */
export function getDistance (point1, point2) {
  const xDif = point1.x - point2.x
  const yDif = point1.y - point2.y
  return Math.sqrt(xDif * xDif + yDif * yDif)
}

/**
 * 获取一点绕另一点旋转一定角度后新的点坐标
 * @param point 旋转点
 * @param targetPoint 参照点
 * @param angle 角度
 * @return {{x: *, y: *}}
 */
export function getRotatePoint (point, targetPoint, angle) {
  const x = (point.x - targetPoint.x) * Math.cos(angle) - (point.y - targetPoint.y) * Math.sin(angle) + targetPoint.x
  const y = (point.x - targetPoint.x) * Math.sin(angle) + (point.y - targetPoint.y) * Math.cos(angle) + targetPoint.y
  return { x, y }
}

/**
 * 获取一次函数斜率和截距，即 y = kx + b 中的k值和b值
 * @param point1
 * @param point2
 */
export function getLinearSlopeIntercept (point1, point2) {
  const difX = (point1.x - point2.x)
  if (difX !== 0) {
    const k = (point1.y - point2.y) / difX
    const b = point1.y - k * point1.x
    return { k, b }
  }
}

/**
 * 获取点在两点决定的一次函数上的y值
 * @param point1
 * @param point2
 * @param targetPoint
 */
export function getLinearYFromPoints (point1, point2, targetPoint) {
  const kb = getLinearSlopeIntercept(point1, point2)
  return getLinearYFromSlopeIntercept(kb, targetPoint)
}

/**
 * 获取点在斜率和截距确定的线上的y值
 * @param kb
 * @param targetPoint
 */
export function getLinearYFromSlopeIntercept (kb, targetPoint) {
  if (kb) {
    return targetPoint.x * kb.k + kb.b
  }
  return targetPoint.y
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
    return Math.abs(targetPoint.x - point1.x) < DEVIATION
  }
  const kb = getLinearSlopeIntercept(point1, point2)
  const y = getLinearYFromSlopeIntercept(kb, targetPoint)
  const yDif = Math.abs(y - targetPoint.y)
  return yDif * yDif / (kb.k * kb.k + 1) < DEVIATION * DEVIATION
}

/**
 * 点是否在线段上
 * @param point1
 * @param point2
 * @param targetPoint
 * @returns {boolean}
 */
export function checkPointOnRayLine (point1, point2, targetPoint) {
  if (checkPointOnStraightLine(point1, point2, targetPoint)) {
    if (point1.x === point2.x) {
      if (point1.y < point2.y) {
        return point1.y - targetPoint.y < DEVIATION
      } else {
        return targetPoint.y - point1.y < DEVIATION
      }
    }
    if (point1.x < point2.x) {
      return point1.x - targetPoint.x < DEVIATION
    } else {
      return targetPoint.x - point1.x < DEVIATION
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
export function checkPointOnSegment (point1, point2, targetPoint) {
  if (checkPointOnStraightLine(point1, point2, targetPoint)) {
    if (point1.x === point2.x) {
      return Math.abs(point1.y - targetPoint.y) + Math.abs(point2.y - targetPoint.y) - Math.abs(point1.y - point2.y) < DEVIATION * 2
    }
    return Math.abs(point1.x - targetPoint.x) + Math.abs(point2.x - targetPoint.x) - Math.abs(point1.x - point2.x) < DEVIATION * 2
  }
  return false
}

/**
 * 点是否在圆内
 * @param circleCenterPoint
 * @param radius
 * @param targetPoint
 * @returns {boolean}
 */
export function checkPointInCircle (circleCenterPoint, radius, targetPoint) {
  if (!targetPoint) {
    return false
  }
  const difX = targetPoint.x - circleCenterPoint.x
  const difY = targetPoint.y - circleCenterPoint.y
  return !(difX * difX + difY * difY > radius * radius)
}

/**
 * 点是否在圆上
 * @param circleCenterPoint
 * @param radius
 * @param targetPoint
 * @return {boolean}
 */
export function checkPointOnCircle (circleCenterPoint, radius, targetPoint) {
  if (!targetPoint) {
    return false
  }
  return Math.abs(getDistance(targetPoint, circleCenterPoint) - radius) < DEVIATION
}

/**
 * 检查点是否在圆弧上
 * @param circleCenterPoint
 * @param radius
 * @param startAngle
 * @param endAngle
 * @param targetPoint
 * @return {boolean}
 */
export function checkPointOnArc (circleCenterPoint, radius, startAngle, endAngle, targetPoint) {
  if (checkPointOnCircle(circleCenterPoint, radius, targetPoint)) {
    const startPointX = radius * Math.cos(startAngle) + circleCenterPoint.x
    const startPointY = radius * Math.sin(startAngle) + circleCenterPoint.y
    const endPointX = radius * Math.cos(endAngle) + circleCenterPoint.x
    const endPointY = radius * Math.sin(endAngle) + circleCenterPoint.y
    return (
      targetPoint.x <= Math.max(startPointX, endPointX) + DEVIATION &&
      targetPoint.x >= Math.min(startPointX, endPointX) - DEVIATION &&
      targetPoint.y <= Math.max(startPointY, endPointY) + DEVIATION &&
      targetPoint.y >= Math.min(startPointY, endPointY) - DEVIATION
    )
  }
}

/**
 * 根据两点获取一条射线
 * @param point1
 * @param point2
 * @param xyMax
 * @return {(*|{x: *, y: *})[]|*[]}
 */
export function getRayLine (point1, point2, xyMax) {
  if (point1 && point2) {
    let point
    if (point1.x === point2.x && point1.y !== point2.y) {
      if (point1.y < point2.y) {
        point = {
          x: point1.x,
          y: xyMax.y
        }
      } else {
        point = {
          x: point1.x,
          y: 0
        }
      }
    } else if (point1.x > point2.x) {
      point = {
        x: 0,
        y: getLinearYFromPoints(point1, point2, { x: 0, y: point1.y })
      }
    } else {
      point = {
        x: xyMax.x,
        y: getLinearYFromPoints(point1, point2, { x: xyMax.x, y: point1.y })
      }
    }
    return [point1, point]
  }
  return []
}

/**
 * 获取平行线
 * @param points
 * @param xyMax
 * @param extendParallelLineCount
 * @returns {Array}
 */
export function getParallelLines (points, xyMax, extendParallelLineCount = 0) {
  const lines = []
  if (points.length > 1) {
    if (points[0].x === points[1].x) {
      const startY = 0
      const endY = xyMax.y
      lines.push([{ x: points[0].x, y: startY }, { x: points[0].x, y: endY }])
      if (points.length > 2) {
        lines.push([{ x: points[2].x, y: startY }, { x: points[2].x, y: endY }])
        const distance = points[0].x - points[2].x
        for (let i = 0; i < extendParallelLineCount; i++) {
          const d = distance * (i + 1)
          lines.push([{ x: points[0].x + d, y: startY }, { x: points[0].x + d, y: endY }])
        }
      }
    } else {
      const startX = 0
      const endX = xyMax.x
      const kb = getLinearSlopeIntercept(points[0], points[1])
      const k = kb.k
      const b = kb.b
      lines.push([{ x: startX, y: startX * k + b }, { x: endX, y: endX * k + b }])
      if (points.length > 2) {
        const b1 = points[2].y - k * points[2].x
        lines.push([{ x: startX, y: startX * k + b1 }, { x: endX, y: endX * k + b1 }])
        const distance = b - b1
        for (let i = 0; i < extendParallelLineCount; i++) {
          const b2 = b + distance * (i + 1)
          lines.push([{ x: startX, y: startX * k + b2 }, { x: endX, y: endX * k + b2 }])
        }
      }
    }
  }
  return lines
}

/**
 * 檢查目標點是否越過線
 * @param point1
 * @param point2
 * @param targetPoint
 * @return {boolean}
 */
export function isCrossed(point1,point2,targetPoint)
{
  return (getLinearYFromPoints(point1,point2,targetPoint)>targetPoint.y)
}
