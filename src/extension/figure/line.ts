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

import TypeOrNull from '../../common/TypeOrNull'
import Coordinate from '../../common/Coordinate'
import { LineStyle, LineType } from '../../common/Styles'

import { FigureTemplate } from '../../componentl/Figure'

function checkCoordinateOnLine (coordinate: Coordinate, line: LineAttrs): boolean {
  let on = false
  const coordinates = line.coordinates
  if (coordinates.length > 1) {
    for (let i = 1; i < coordinates.length; i++) {
      const prevCoordinate = coordinates[i - 1]
      const currentCoordinate = coordinates[i]
      if (prevCoordinate.x === currentCoordinate.x) {
        on = Math.abs(coordinate.x - prevCoordinate.x) < 2
      } else {
        const kb = getLinearSlopeIntercept(prevCoordinate, currentCoordinate) as number[]
        const y = getLinearYFromSlopeIntercept(kb, coordinate)
        const yDif = Math.abs(y - coordinate.y)
        on = yDif * yDif / (kb[0] * kb[0] + 1) < 2 * 2
      }
      if (on) {
        return on
      }
    }
  }
  return on
}

export function getLinearYFromSlopeIntercept (kb: TypeOrNull<number[]>, coordinate: Coordinate): number {
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

export function getLinearSlopeIntercept (coordinate1: Coordinate, coordinate2: Coordinate): TypeOrNull<number[]> {
  const difX = coordinate1.x - coordinate2.x
  if (difX !== 0) {
    const k = (coordinate1.y - coordinate2.y) / difX
    const b = coordinate1.y - k * coordinate1.x
    return [k, b]
  }
  return null
}

function drawLine (ctx: CanvasRenderingContext2D, attrs: LineAttrs, styles: Partial<LineStyle>): void {
  const { coordinates } = attrs
  if (coordinates.length > 1) {
    const { style = LineType.SOLID, size = 1, color = 'currentColor', dashedValue = [2, 2] } = styles
    ctx.lineWidth = size
    ctx.strokeStyle = color
    if (style === LineType.DASHED) {
      ctx.setLineDash(dashedValue)
    } else {
      ctx.setLineDash([])
    }
    ctx.beginPath()
    ctx.moveTo(coordinates[0].x, coordinates[0].y)
    for (let i = 1; i < coordinates.length; i++) {
      ctx.lineTo(coordinates[i].x, coordinates[i].y)
    }
    ctx.stroke()
    ctx.closePath()
  }
}

export interface LineAttrs {
  coordinates: Coordinate[]
}

const line: FigureTemplate<LineAttrs, Partial<LineStyle>> = {
  name: 'line',
  checkEventOn: checkCoordinateOnLine,
  draw: (ctx: CanvasRenderingContext2D, attrs: LineAttrs, styles: Partial<LineStyle>) => {
    drawLine(ctx, attrs, styles)
  }
}

export default line
