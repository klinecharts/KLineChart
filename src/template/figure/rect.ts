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

import { Figure } from './Figure'

function checkCoordinateOnRect (coordinate: Coordinate, rect: Omit<RectAttrs, 'styles'>): boolean {
  return (
    coordinate.x >= rect.x &&
    coordinate.x <= rect.x + rect.width &&
    coordinate.y >= rect.y &&
    coordinate.y <= rect.y + rect.height
  )
}

function drawRect (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, isFill?: boolean): void {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
  if (isFill ?? false) {
    ctx.fill()
  } else {
    ctx.stroke()
  }
}

export interface RectStyle {
  fillColor: string | CanvasGradient
  stokeColor: string
  strokeSize: number
  style: 'fill' | 'stroke' | 'stroke-fill'
  radius: number
}

export interface RectAttrs {
  x: number
  y: number
  width: number
  height: number
  styles: RectStyle
}

const rect: Figure<RectAttrs> = {
  name: 'rect',
  checkEventOn: checkCoordinateOnRect,
  draw: (ctx: CanvasRenderingContext2D, attrs: RectAttrs) => {
    const { x, y, width, height, styles } = attrs
    ctx.strokeStyle = styles.stokeColor
    ctx.fillStyle = styles.fillColor
    ctx.lineWidth = styles.strokeSize
    const r = styles.radius
    if (styles.style === 'fill' || styles.style === 'stroke-fill') {
      drawRect(ctx, x, y, width, height, r, true)
      ctx.fill()
    }
    if (styles.style === 'stroke' || styles.style === 'stroke-fill') {
      drawRect(ctx, x, y, width, height, r)
    }
  }
}

export default rect
