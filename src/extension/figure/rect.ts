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
import { type RectStyle, PolygonType, LineType } from '../../common/Styles'
import { isTransparent } from '../../common/utils/color'
import { isString } from '../../common/utils/typeChecks'

import { type FigureTemplate, DEVIATION } from '../../component/Figure'

export function checkCoordinateOnRect (coordinate: Coordinate, attrs: RectAttrs | RectAttrs[]): boolean {
  let rects: RectAttrs[] = []
  rects = rects.concat(attrs)
  for (const rect of rects) {
    let x = rect.x
    let width = rect.width
    if (width < DEVIATION * 2) {
      x -= DEVIATION
      width = DEVIATION * 2
    }
    let y = rect.y
    let height = rect.height
    if (height < DEVIATION * 2) {
      y -= DEVIATION
      height = DEVIATION * 2
    }
    if (
      coordinate.x >= x &&
      coordinate.x <= x + width &&
      coordinate.y >= y &&
      coordinate.y <= y + height
    ) {
      return true
    }
  }
  return false
}

export function drawRect (ctx: CanvasRenderingContext2D, attrs: RectAttrs | RectAttrs[], styles: Partial<RectStyle>): void {
  let rects: RectAttrs[] = []
  rects = rects.concat(attrs)
  const {
    style = PolygonType.Fill,
    color = 'transparent',
    borderSize = 1,
    borderColor = 'transparent',
    borderStyle = LineType.Solid,
    borderRadius: r = 0,
    borderDashedValue = [2, 2]
  } = styles
  // eslint-disable-next-line @typescript-eslint/unbound-method, @typescript-eslint/no-unnecessary-condition -- ignore
  const draw = ctx.roundRect ?? ctx.rect
  const solid = (style === PolygonType.Fill || styles.style === PolygonType.StrokeFill) && (!isString(color) || !isTransparent(color))
  if (solid) {
    ctx.fillStyle = color
    rects.forEach(({ x, y, width: w, height: h }) => {
      ctx.beginPath()
      draw.call(ctx, x, y, w, h, r)
      ctx.closePath()
      ctx.fill()
    })
  }
  if ((style === PolygonType.Stroke || styles.style === PolygonType.StrokeFill) && borderSize > 0 && !isTransparent(borderColor)) {
    ctx.strokeStyle = borderColor
    ctx.fillStyle = borderColor
    ctx.lineWidth = borderSize
    if (borderStyle === LineType.Dashed) {
      ctx.setLineDash(borderDashedValue)
    } else {
      ctx.setLineDash([])
    }
    const correction = borderSize % 2 === 1 ? 0.5 : 0
    const doubleCorrection = Math.round(correction * 2)
    rects.forEach(({ x, y, width: w, height: h }) => {
      if (w > borderSize * 2 && h > borderSize * 2) {
        ctx.beginPath()
        draw.call(ctx, x + correction, y + correction, w - doubleCorrection, h - doubleCorrection, r)
        ctx.closePath()
        ctx.stroke()
      } else {
        if (!solid) {
          ctx.fillRect(x, y, w, h)
        }
      }
    })
  }
}

export interface RectAttrs {
  x: number
  y: number
  width: number
  height: number
}

const rect: FigureTemplate<RectAttrs | RectAttrs[], Partial<RectStyle>> = {
  name: 'rect',
  checkEventOn: checkCoordinateOnRect,
  draw: (ctx: CanvasRenderingContext2D, attrs: RectAttrs | RectAttrs[], styles: Partial<RectStyle>) => {
    drawRect(ctx, attrs, styles)
  }
}

export default rect
