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

import type Coordinate from '../../common/Coordinate'
import { getDistance } from '../../common/Coordinate'
import { type LineStyle, LineType } from '../../common/Styles'

import { type FigureTemplate, DEVIATION } from '../../component/Figure'

import { type CircleAttrs } from './circle'

export function checkCoordinateOnArc (coordinate: Coordinate, attrs: ArcAttrs | ArcAttrs[]): boolean {
  let arcs: ArcAttrs[] = []
  arcs = arcs.concat(attrs)
  for (let i = 0; i < arcs.length; i++) {
    const arc = arcs[i]
    if (Math.abs(getDistance(coordinate, arc) - arc.r) < DEVIATION) {
      const { r, startAngle, endAngle } = arc
      const startCoordinateX = r * Math.cos(startAngle) + arc.x
      const startCoordinateY = r * Math.sin(startAngle) + arc.y
      const endCoordinateX = r * Math.cos(endAngle) + arc.x
      const endCoordinateY = r * Math.sin(endAngle) + arc.y
      if (
        coordinate.x <= Math.max(startCoordinateX, endCoordinateX) + DEVIATION &&
        coordinate.x >= Math.min(startCoordinateX, endCoordinateX) - DEVIATION &&
        coordinate.y <= Math.max(startCoordinateY, endCoordinateY) + DEVIATION &&
        coordinate.y >= Math.min(startCoordinateY, endCoordinateY) - DEVIATION
      ) {
        return true
      }
    }
  }

  return false
}

export function drawArc (ctx: CanvasRenderingContext2D, attrs: ArcAttrs | ArcAttrs[], styles: Partial<LineStyle>): void {
  let arcs: ArcAttrs[] = []
  arcs = arcs.concat(attrs)
  const { style = LineType.Solid, size = 1, color = 'currentColor', dashedValue = [2, 2] } = styles
  ctx.lineWidth = size
  ctx.strokeStyle = color
  if (style === LineType.Dashed) {
    ctx.setLineDash(dashedValue)
  } else {
    ctx.setLineDash([])
  }
  arcs.forEach(({ x, y, r, startAngle, endAngle }) => {
    ctx.beginPath()
    ctx.arc(x, y, r, startAngle, endAngle)
    ctx.stroke()
    ctx.closePath()
  })
}

export interface ArcAttrs extends CircleAttrs {
  startAngle: number
  endAngle: number
}

const arc: FigureTemplate<ArcAttrs | ArcAttrs[], Partial<LineStyle>> = {
  name: 'arc',
  checkEventOn: checkCoordinateOnArc,
  draw: (ctx: CanvasRenderingContext2D, attrs: ArcAttrs | ArcAttrs[], styles: Partial<LineStyle>) => {
    drawArc(ctx, attrs, styles)
  }
}

export default arc
