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

import Coordinate from '../../common/Coordinate'
import { LineStyle } from '../../common/Options'

import { FigureTemplate, DEVIATION } from '../../component/Figure'

export function checkCoordinateOnWick (coordinate: Coordinate, line: WickAttrs): boolean {
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
      }
    }
  }
  return false
}

export function drawWick (ctx: CanvasRenderingContext2D, attrs: WickAttrs, styles: Partial<LineStyle>): void {
  const { coordinates } = attrs
  const length = coordinates.length
  if (length > 1) {
    const { size = 1, color = 'currentColor' } = styles
    ctx.lineWidth = size
    ctx.strokeStyle = color
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.moveTo(coordinates[0].x, coordinates[0].y)
    ctx.lineTo(coordinates[1].x, coordinates[1].y)
    ctx.stroke()
    ctx.closePath()
  }
}

export interface WickAttrs {
  coordinates: Coordinate[]
}

const line: FigureTemplate<WickAttrs, Partial<LineStyle>> = {
  name: 'wick',
  checkEventOn: checkCoordinateOnWick,
  draw: (ctx: CanvasRenderingContext2D, attrs: WickAttrs, styles: Partial<LineStyle>) => {
    drawWick(ctx, attrs, styles)
  }
}

export default line
