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
import { RectStyle, PolygonType, LineType } from '../../common/Options'

import { FigureTemplate } from '../../component/Figure'

export function checkCoordinateOnRect (coordinate: Coordinate, rect: RectAttrs): boolean {
  return (
    coordinate.x >= rect.x &&
    coordinate.x <= rect.x + rect.width &&
    coordinate.y >= rect.y &&
    coordinate.y <= rect.y + rect.height
  )
}

export function drawRect (ctx: CanvasRenderingContext2D, attrs: RectAttrs, styles: Partial<RectStyle>): void {
  const { x, y, width: w, height: h } = attrs
  const {
    style = PolygonType.FILL,
    color = 'currentColor',
    borderSize = 1,
    borderColor = 'currentColor',
    borderStyle = LineType.SOLID,
    borderRadius: r = 0,
    borderDashedValue = [2, 2]
  } = styles
  if (style === PolygonType.FILL || styles.style === PolygonType.STROKE_FILL) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()
    ctx.fill()
  }
  if (style === PolygonType.STROKE || styles.style === PolygonType.STROKE_FILL) {
    ctx.strokeStyle = borderColor
    ctx.lineWidth = borderSize
    if (borderStyle === LineType.DASHED) {
      ctx.setLineDash(borderDashedValue)
    } else {
      ctx.setLineDash([])
    }
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()
    ctx.stroke()
  }
}

export interface RectAttrs {
  x: number
  y: number
  width: number
  height: number
}

const rect: FigureTemplate<RectAttrs, Partial<RectStyle>> = {
  name: 'rect',
  checkEventOn: checkCoordinateOnRect,
  draw: (ctx: CanvasRenderingContext2D, attrs: RectAttrs, styles: Partial<RectStyle>) => {
    drawRect(ctx, attrs, styles)
  }
}

export default rect
