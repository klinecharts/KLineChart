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

function getDistance (coordinate1: Coordinate, coordinate2: Coordinate): number {
  return Math.sqrt(Math.pow(coordinate1.x + coordinate2.x, 2) + Math.pow(coordinate1.y + coordinate2.y, 2))
}

function getSmoothControlCoordinate (coordinates: Coordinate[]): Coordinate[] {
  const d01 = getDistance(coordinates[0], coordinates[1])
  const d12 = getDistance(coordinates[1], coordinates[2])
  const d02 = d01 + d12
  const vector = [coordinates[2].x - coordinates[0].x, coordinates[2].y - coordinates[0].y]
  return [
    {
      x: coordinates[1].x - vector[0] * 0.5 * d01 / d02,
      y: coordinates[1].y - vector[1] * 0.5 * d01 / d02
    }, {
      x: coordinates[1].x + vector[0] * 0.5 * d01 / d02,
      y: coordinates[1].y + vector[1] * 0.5 * d01 / d02
    }
  ]
}

export function checkCoordinateOnLine (coordinate: Coordinate, line: LineAttrs): boolean {
  const coordinates = line.coordinates
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
  return false
}

export function getLinearYFromSlopeIntercept (kb: Nullable<number[]>, coordinate: Coordinate): number {
  if (kb != null) {
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

export function drawLine (ctx: CanvasRenderingContext2D, attrs: LineAttrs, styles: Partial<SmoothLineStyle>): void {
  const { coordinates } = attrs
  const length = coordinates.length
  if (length > 1) {
    const { style = LineType.Solid, smooth, size = 1, color = 'currentColor', dashedValue = [2, 2] } = styles
    ctx.lineWidth = size
    ctx.strokeStyle = color
    if (style === LineType.Dashed) {
      ctx.setLineDash(dashedValue)
    } else {
      ctx.setLineDash([])
    }
    ctx.beginPath()
    ctx.moveTo(coordinates[0].x, coordinates[0].y)

    if (smooth ?? false) {
      let controlCoordinates: Coordinate[] = []
      for (let i = 1; i < length - 1; i++) {
        controlCoordinates = controlCoordinates.concat(getSmoothControlCoordinate([coordinates[i - 1], coordinates[i], coordinates[i + 1]]))
      }
      ctx.quadraticCurveTo(controlCoordinates[0].x, controlCoordinates[0].y, coordinates[1].x, coordinates[1].y)
      let i = 2
      for (; i < length - 1; i++) {
        ctx.bezierCurveTo(
          controlCoordinates[(i - 2) * 2 + 1].x,
          controlCoordinates[(i - 2) * 2 + 1].y,
          controlCoordinates[(i - 1) * 2].x,
          controlCoordinates[(i - 1) * 2].y,
          coordinates[i].x,
          coordinates[i].y
        )
      }
      ctx.quadraticCurveTo(
        controlCoordinates[(i - 2) * 2 + 1].x,
        controlCoordinates[(i - 2) * 2 + 1].y,
        coordinates[i].x,
        coordinates[i].y
      )
    } else {
      for (let i = 1; i < coordinates.length; i++) {
        ctx.lineTo(coordinates[i].x, coordinates[i].y)
      }
    }
    ctx.stroke()
    ctx.closePath()
  }
}

export interface LineAttrs {
  coordinates: Coordinate[]
}

const line: FigureTemplate<LineAttrs, Partial<SmoothLineStyle>> = {
  name: 'line',
  checkEventOn: checkCoordinateOnLine,
  draw: (ctx: CanvasRenderingContext2D, attrs: LineAttrs, styles: Partial<SmoothLineStyle>) => {
    drawLine(ctx, attrs, styles)
  }
}

export default line
