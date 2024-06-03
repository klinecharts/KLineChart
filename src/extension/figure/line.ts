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

import type Nullable from '../../common/Nullable'
import type Coordinate from '../../common/Coordinate'
import { type SmoothLineStyle, LineType } from '../../common/Styles'

import { type FigureTemplate, DEVIATION } from '../../component/Figure'
import { isNumber } from '../../common/utils/typeChecks'

export function checkCoordinateOnLine (coordinate: Coordinate, attrs: LineAttrs | LineAttrs[]): boolean {
  let lines: LineAttrs[] = []
  lines = lines.concat(attrs)

  for (let i = 0; i < lines.length; i++) {
    const { coordinates } = lines[i]
    if (coordinates.length > 1) {
      for (let i = 1; i < coordinates.length; i++) {
        const prevCoordinate = coordinates[i - 1]
        const currentCoordinate = coordinates[i]
        if (prevCoordinate.x === currentCoordinate.x) {
          if (
            Math.abs(prevCoordinate.y - coordinate.y) + Math.abs(currentCoordinate.y - coordinate.y) - Math.abs(prevCoordinate.y - currentCoordinate.y) < DEVIATION + DEVIATION &&
            Math.abs(coordinate.x - prevCoordinate.x) < DEVIATION
          ) {
            return true
          }
        } else {
          const kb = getLinearSlopeIntercept(prevCoordinate, currentCoordinate)!
          const y = getLinearYFromSlopeIntercept(kb, coordinate)
          const yDif = Math.abs(y - coordinate.y)
          if (
            Math.abs(prevCoordinate.x - coordinate.x) + Math.abs(currentCoordinate.x - coordinate.x) - Math.abs(prevCoordinate.x - currentCoordinate.x) < DEVIATION + DEVIATION &&
            yDif * yDif / (kb[0] * kb[0] + 1) < DEVIATION * DEVIATION
          ) {
            return true
          }
        }
      }
    }
  }
  return false
}

export function getLinearYFromSlopeIntercept (kb: Nullable<number[]>, coordinate: Coordinate): number {
  if (kb !== null) {
    return coordinate.x * kb[0] + kb[1]
  }
  return coordinate.y
}

/**
 * 获取点在两点决定的一次函数上的y值
 * @param coordinate1
 * @param coordinate2
 * @param targetCoordinate
 */
export function getLinearYFromCoordinates (coordinate1: Coordinate, coordinate2: Coordinate, targetCoordinate: Coordinate): number {
  const kb = getLinearSlopeIntercept(coordinate1, coordinate2)
  return getLinearYFromSlopeIntercept(kb, targetCoordinate)
}

export function getLinearSlopeIntercept (coordinate1: Coordinate, coordinate2: Coordinate): Nullable<number[]> {
  const difX = coordinate1.x - coordinate2.x
  if (difX !== 0) {
    const k = (coordinate1.y - coordinate2.y) / difX
    const b = coordinate1.y - k * coordinate1.x
    return [k, b]
  }
  return null
}

export function lineTo (ctx: CanvasRenderingContext2D, coordinates: Coordinate[], smooth: number | boolean): void {
  const length = coordinates.length
  const smoothParam = isNumber(smooth) ? (smooth > 0 && smooth < 1 ? smooth : 0) : (smooth ? 0.5 : 0)
  if ((smoothParam > 0) && length > 2) {
    let cpx0 = coordinates[0].x
    let cpy0 = coordinates[0].y
    for (let i = 1; i < length - 1; i++) {
      const prevCoordinate = coordinates[i - 1]
      const coordinate = coordinates[i]
      const nextCoordinate = coordinates[i + 1]
      const dx01 = coordinate.x - prevCoordinate.x
      const dy01 = coordinate.y - prevCoordinate.y
      const dx12 = nextCoordinate.x - coordinate.x
      const dy12 = nextCoordinate.y - coordinate.y
      let dx02 = nextCoordinate.x - prevCoordinate.x
      let dy02 = nextCoordinate.y - prevCoordinate.y
      const prevSegmentLength = Math.sqrt(dx01 * dx01 + dy01 * dy01)
      const nextSegmentLength = Math.sqrt(dx12 * dx12 + dy12 * dy12)
      const segmentLengthRatio = nextSegmentLength / (nextSegmentLength + prevSegmentLength)

      let nextCpx = coordinate.x + dx02 * smoothParam * segmentLengthRatio
      let nextCpy = coordinate.y + dy02 * smoothParam * segmentLengthRatio
      nextCpx = Math.min(nextCpx, Math.max(nextCoordinate.x, coordinate.x))
      nextCpy = Math.min(nextCpy, Math.max(nextCoordinate.y, coordinate.y))
      nextCpx = Math.max(nextCpx, Math.min(nextCoordinate.x, coordinate.x))
      nextCpy = Math.max(nextCpy, Math.min(nextCoordinate.y, coordinate.y))

      dx02 = nextCpx - coordinate.x
      dy02 = nextCpy - coordinate.y

      let cpx1 = coordinate.x - dx02 * prevSegmentLength / nextSegmentLength
      let cpy1 = coordinate.y - dy02 * prevSegmentLength / nextSegmentLength

      cpx1 = Math.min(cpx1, Math.max(prevCoordinate.x, coordinate.x))
      cpy1 = Math.min(cpy1, Math.max(prevCoordinate.y, coordinate.y))
      cpx1 = Math.max(cpx1, Math.min(prevCoordinate.x, coordinate.x))
      cpy1 = Math.max(cpy1, Math.min(prevCoordinate.y, coordinate.y))

      dx02 = coordinate.x - cpx1
      dy02 = coordinate.y - cpy1
      nextCpx = coordinate.x + dx02 * nextSegmentLength / prevSegmentLength
      nextCpy = coordinate.y + dy02 * nextSegmentLength / prevSegmentLength

      ctx.bezierCurveTo(cpx0, cpy0, cpx1, cpy1, coordinate.x, coordinate.y)

      cpx0 = nextCpx
      cpy0 = nextCpy
    }
    const lastCoordinate = coordinates[length - 1]
    ctx.bezierCurveTo(cpx0, cpy0, lastCoordinate.x, lastCoordinate.y, lastCoordinate.x, lastCoordinate.y)
  } else {
    for (let i = 1; i < length; i++) {
      ctx.lineTo(coordinates[i].x, coordinates[i].y)
    }
  }
}

export function drawLine (ctx: CanvasRenderingContext2D, attrs: LineAttrs | LineAttrs[], styles: Partial<SmoothLineStyle>): void {
  let lines: LineAttrs[] = []
  lines = lines.concat(attrs)
  const { style = LineType.Solid, smooth = false, size = 1, color = 'currentColor', dashedValue = [2, 2] } = styles
  ctx.lineWidth = size
  ctx.strokeStyle = color
  if (style === LineType.Dashed) {
    ctx.setLineDash(dashedValue)
  } else {
    ctx.setLineDash([])
  }
  const correction = size % 2 === 1 ? 0.5 : 0
  lines.forEach(({ coordinates }) => {
    if (coordinates.length > 1) {
      if (
        coordinates.length === 2 &&
        (
          coordinates[0].x === coordinates[1].x ||
          coordinates[0].y === coordinates[1].y
        )
      ) {
        ctx.beginPath()
        if (coordinates[0].x === coordinates[1].x) {
          ctx.moveTo(coordinates[0].x + correction, coordinates[0].y)
          ctx.lineTo(coordinates[1].x + correction, coordinates[1].y)
        } else {
          ctx.moveTo(coordinates[0].x, coordinates[0].y + correction)
          ctx.lineTo(coordinates[1].x, coordinates[1].y + correction)
        }
        ctx.stroke()
        ctx.closePath()
      } else {
        ctx.save()
        if (size % 2 === 1) {
          ctx.translate(0.5, 0.5)
        }
        ctx.beginPath()
        ctx.moveTo(coordinates[0].x, coordinates[0].y)
        lineTo(ctx, coordinates, smooth)
        ctx.stroke()
        ctx.closePath()
        ctx.restore()
      }
    }
  })
}

export interface LineAttrs {
  coordinates: Coordinate[]
}

const line: FigureTemplate<LineAttrs | LineAttrs[], Partial<SmoothLineStyle>> = {
  name: 'line',
  checkEventOn: checkCoordinateOnLine,
  draw: (ctx: CanvasRenderingContext2D, attrs: LineAttrs | LineAttrs[], styles: Partial<SmoothLineStyle>) => {
    drawLine(ctx, attrs, styles)
  }
}

export default line
