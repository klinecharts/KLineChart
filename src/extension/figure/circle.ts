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
import { type PolygonStyle, PolygonType, LineType } from '../../common/Styles'
import { isString } from '../../common/utils/typeChecks'
import { isTransparent } from '../../common/utils/color'

import { type FigureTemplate } from '../../component/Figure'

export function checkCoordinateOnCircle (coordinate: Coordinate, circle: CircleAttrs): boolean {
  const difX = coordinate.x - circle.x
  const difY = coordinate.y - circle.y
  const r = circle.r
  return !(difX * difX + difY * difY > r * r)
}

export function drawCircle (ctx: CanvasRenderingContext2D, attrs: CircleAttrs, styles: Partial<PolygonStyle>): void {
  const { x, y, r } = attrs
  const {
    style = PolygonType.Fill,
    color = 'currentColor',
    borderSize = 1,
    borderColor = 'currentColor',
    borderStyle = LineType.Solid,
    borderDashedValue = [2, 2]
  } = styles
  if (
    (style === PolygonType.Fill || styles.style === PolygonType.StrokeFill) &&
    (!isString(color) || !isTransparent(color))
  ) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
  }
  if ((style === PolygonType.Stroke || styles.style === PolygonType.StrokeFill) && borderSize > 0 && !isTransparent(borderColor)) {
    ctx.strokeStyle = borderColor
    ctx.lineWidth = borderSize
    if (borderStyle === LineType.Dashed) {
      ctx.setLineDash(borderDashedValue)
    } else {
      ctx.setLineDash([])
    }
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.closePath()
    ctx.stroke()
  }
}

export interface CircleAttrs {
  x: number
  y: number
  r: number
}

const circle: FigureTemplate<CircleAttrs, Partial<PolygonStyle>> = {
  name: 'circle',
  checkEventOn: checkCoordinateOnCircle,
  draw: (ctx: CanvasRenderingContext2D, attrs: CircleAttrs, styles: Partial<PolygonStyle>) => {
    drawCircle(ctx, attrs, styles)
  }
}

export default circle
