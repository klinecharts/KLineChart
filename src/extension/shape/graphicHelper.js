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
 * @param coordinate
 * @param coordinate2
 * @return {number}
 */
export function getDistance (coordinate1, coordinate2) {
  const xDif = coordinate1.x - coordinate2.x
  const yDif = coordinate1.y - coordinate2.y
  return Math.sqrt(xDif * xDif + yDif * yDif)
}

/**
 * 根据三角形三个点获取三角形面积
 * @param coordinate1
 * @param coordinate2
 * @param coordinate3
 * @return {number}
 */
export function getTriangleSquare (coordinate1, coordinate2, coordinate3) {
  const x1 = Math.abs(coordinate2.x - coordinate1.x)
  const y1 = Math.abs(coordinate2.y - coordinate1.y)
  const x2 = Math.abs(coordinate3.x - coordinate1.x)
  const y2 = Math.abs(coordinate3.y - coordinate1.y)
  return Math.abs(x1 * y2 - x2 * y1) / 2
}

/**
 * 获取一点绕另一点旋转一定角度后新的点坐标
 * @param coordinate 旋转点
 * @param targetCoordinate 参照点
 * @param angle 角度
 * @return {{x: *, y: *}}
 */
export function getRotateCoordinate (coordinate, targetCoordinate, angle) {
  const x = (coordinate.x - targetCoordinate.x) * Math.cos(angle) - (coordinate.y - targetCoordinate.y) * Math.sin(angle) + targetCoordinate.x
  const y = (coordinate.x - targetCoordinate.x) * Math.sin(angle) + (coordinate.y - targetCoordinate.y) * Math.cos(angle) + targetCoordinate.y
  return { x, y }
}

/**
 * 获取一次函数斜率和截距，即 y = kx + b 中的k值和b值
 * @param coordinate1
 * @param coordinate2
 */
export function getLinearSlopeIntercept (coordinate1, coordinate2) {
  const difX = (coordinate1.x - coordinate2.x)
  if (difX !== 0) {
    const k = (coordinate1.y - coordinate2.y) / difX
    const b = coordinate1.y - k * coordinate1.x
    return { k, b }
  }
}

/**
 * 获取点在两点决定的一次函数上的y值
 * @param coordinate1
 * @param coordinate2
 * @param targetCoordinate
 */
export function getLinearYFromCoordinates (coordinate1, coordinate2, targetCoordinate) {
  const kb = getLinearSlopeIntercept(coordinate1, coordinate2)
  return getLinearYFromSlopeIntercept(kb, targetCoordinate)
}

/**
 * 获取点在斜率和截距确定的线上的y值
 * @param kb
 * @param targetCoordinate
 */
export function getLinearYFromSlopeIntercept (kb, targetCoordinate) {
  if (kb) {
    return targetCoordinate.x * kb.k + kb.b
  }
  return targetCoordinate.y
}

/**
 * 点是否在线上
 * @param coordinate1
 * @param coordinate2
 * @param targetCoordinate
 */
export function checkCoordinateOnStraightLine (coordinate1, coordinate2, targetCoordinate) {
  if (!targetCoordinate || !coordinate1 || !coordinate2) {
    return false
  }
  if (coordinate1.x === coordinate2.x) {
    return Math.abs(targetCoordinate.x - coordinate1.x) < DEVIATION
  }
  const kb = getLinearSlopeIntercept(coordinate1, coordinate2)
  const y = getLinearYFromSlopeIntercept(kb, targetCoordinate)
  const yDif = Math.abs(y - targetCoordinate.y)
  return yDif * yDif / (kb.k * kb.k + 1) < DEVIATION * DEVIATION
}

/**
 * 点是否在线段上
 * @param coordinate1
 * @param coordinate2
 * @param targetCoordinate
 * @returns {boolean}
 */
export function checkCoordinateOnRayLine (coordinate1, coordinate2, targetCoordinate) {
  if (checkCoordinateOnStraightLine(coordinate1, coordinate2, targetCoordinate)) {
    if (coordinate1.x === coordinate2.x) {
      if (coordinate1.y < coordinate2.y) {
        return coordinate1.y - targetCoordinate.y < DEVIATION
      } else {
        return targetCoordinate.y - coordinate1.y < DEVIATION
      }
    }
    if (coordinate1.x < coordinate2.x) {
      return coordinate1.x - targetCoordinate.x < DEVIATION
    } else {
      return targetCoordinate.x - coordinate1.x < DEVIATION
    }
  }
  return false
}

/**
 * 判断点是否在线段上面
 * @param coordinate1
 * @param coordinate2
 * @param targetCoordinate
 */
export function checkCoordinateOnSegment (coordinate1, coordinate2, targetCoordinate) {
  if (checkCoordinateOnStraightLine(coordinate1, coordinate2, targetCoordinate)) {
    if (coordinate1.x === coordinate2.x) {
      return Math.abs(coordinate1.y - targetCoordinate.y) + Math.abs(coordinate2.y - targetCoordinate.y) - Math.abs(coordinate1.y - coordinate2.y) < DEVIATION * 2
    }
    return Math.abs(coordinate1.x - targetCoordinate.x) + Math.abs(coordinate2.x - targetCoordinate.x) - Math.abs(coordinate1.x - coordinate2.x) < DEVIATION * 2
  }
  return false
}

/**
 * 点是否在圆内
 * @param circleCenterCoordinate
 * @param radius
 * @param targetCoordinate
 * @returns {boolean}
 */
export function checkCoordinateInCircle (circleCenterCoordinate, radius, targetCoordinate) {
  if (!targetCoordinate) {
    return false
  }
  const difX = targetCoordinate.x - circleCenterCoordinate.x
  const difY = targetCoordinate.y - circleCenterCoordinate.y
  return !(difX * difX + difY * difY > radius * radius)
}

/**
 * 点是否在圆上
 * @param circleCenterCoordinate
 * @param radius
 * @param targetCoordinate
 * @return {boolean}
 */
export function checkCoordinateOnCircle (circleCenterCoordinate, radius, targetCoordinate) {
  if (!targetCoordinate) {
    return false
  }
  return Math.abs(getDistance(targetCoordinate, circleCenterCoordinate) - radius) < DEVIATION
}

/**
 * 检查点是否在圆弧上
 * @param circleCenterCoordinate
 * @param radius
 * @param startAngle
 * @param endAngle
 * @param targetCoordinate
 * @return {boolean}
 */
export function checkCoordinateOnArc (circleCenterCoordinate, radius, startAngle, endAngle, targetCoordinate) {
  if (checkCoordinateOnCircle(circleCenterCoordinate, radius, targetCoordinate)) {
    const startCoordinateX = radius * Math.cos(startAngle) + circleCenterCoordinate.x
    const startCoordinateY = radius * Math.sin(startAngle) + circleCenterCoordinate.y
    const endCoordinateX = radius * Math.cos(endAngle) + circleCenterCoordinate.x
    const endCoordinateY = radius * Math.sin(endAngle) + circleCenterCoordinate.y
    return (
      targetCoordinate.x <= Math.max(startCoordinateX, endCoordinateX) + DEVIATION &&
      targetCoordinate.x >= Math.min(startCoordinateX, endCoordinateX) - DEVIATION &&
      targetCoordinate.y <= Math.max(startCoordinateY, endCoordinateY) + DEVIATION &&
      targetCoordinate.y >= Math.min(startCoordinateY, endCoordinateY) - DEVIATION
    )
  }
}

/**
 * 检查点是否在三角形内部
 * @param triangleCoordinates
 * @param targetCoordinate
 * @return {boolean}
 */
export function checkCoordinateInTriangle (triangleCoordinates, targetCoordinate) {
  const square = getTriangleSquare(triangleCoordinates[0], triangleCoordinates[1], triangleCoordinates[2])
  const compareSquare =
    getTriangleSquare(triangleCoordinates[0], triangleCoordinates[1], targetCoordinate) +
    getTriangleSquare(triangleCoordinates[0], triangleCoordinates[2], targetCoordinate) +
    getTriangleSquare(triangleCoordinates[1], triangleCoordinates[2], targetCoordinate)
  return Math.abs(square - compareSquare) < DEVIATION
}

/**
 * 检查点是否在三角形菱形内部
 * @param centerCoordinate
 * @param width
 * @param height
 * @param targetCoordinate
 * @return {boolean}
 */
export function checkCoordinateInDiamond (centerCoordinate, width, height, targetCoordinate) {
  const xDis = Math.abs(centerCoordinate.x - targetCoordinate.x)
  const yDis = Math.abs(centerCoordinate.y - targetCoordinate.y)
  return xDis * height + yDis * width < width * height / 2 + DEVIATION
}

/**
 * 检查点是否在矩形内部
 * @param coordinate1
 * @param coordinate2
 * @param targetCoordinate
 * @return {boolean}
 */
export function checkCoordinateInRect (coordinate1, coordinate2, targetCoordinate) {
  return targetCoordinate.x >= coordinate1.x && targetCoordinate.x <= coordinate2.x && targetCoordinate.y >= coordinate1.y && targetCoordinate.y <= coordinate2.y
}

/**
 * 根据两点获取一条射线
 * @param coordinate1
 * @param coordinate2
 * @param xyMax
 * @return {(*|{x: *, y: *})[]|*[]}
 */
export function getRayLine (coordinate1, coordinate2, xyMax) {
  if (coordinate1 && coordinate2) {
    let coordinate
    if (coordinate1.x === coordinate2.x && coordinate1.y !== coordinate2.y) {
      if (coordinate1.y < coordinate2.y) {
        coordinate = {
          x: coordinate1.x,
          y: xyMax.y
        }
      } else {
        coordinate = {
          x: coordinate1.x,
          y: 0
        }
      }
    } else if (coordinate1.x > coordinate2.x) {
      coordinate = {
        x: 0,
        y: getLinearYFromCoordinates(coordinate1, coordinate2, { x: 0, y: coordinate1.y })
      }
    } else {
      coordinate = {
        x: xyMax.x,
        y: getLinearYFromCoordinates(coordinate1, coordinate2, { x: xyMax.x, y: coordinate1.y })
      }
    }
    return [coordinate1, coordinate]
  }
  return []
}

/**
 * 获取平行线
 * @param coordinates
 * @param xyMax
 * @param extendParallelLineCount
 * @returns {Array}
 */
export function getParallelLines (coordinates, xyMax, extendParallelLineCount = 0) {
  const lines = []
  if (coordinates.length > 1) {
    if (coordinates[0].x === coordinates[1].x) {
      const startY = 0
      const endY = xyMax.y
      lines.push([{ x: coordinates[0].x, y: startY }, { x: coordinates[0].x, y: endY }])
      if (coordinates.length > 2) {
        lines.push([{ x: coordinates[2].x, y: startY }, { x: coordinates[2].x, y: endY }])
        const distance = coordinates[0].x - coordinates[2].x
        for (let i = 0; i < extendParallelLineCount; i++) {
          const d = distance * (i + 1)
          lines.push([{ x: coordinates[0].x + d, y: startY }, { x: coordinates[0].x + d, y: endY }])
        }
      }
    } else {
      const startX = 0
      const endX = xyMax.x
      const kb = getLinearSlopeIntercept(coordinates[0], coordinates[1])
      const k = kb.k
      const b = kb.b
      lines.push([{ x: startX, y: startX * k + b }, { x: endX, y: endX * k + b }])
      if (coordinates.length > 2) {
        const b1 = coordinates[2].y - k * coordinates[2].x
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
