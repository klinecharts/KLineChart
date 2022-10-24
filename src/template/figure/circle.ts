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

function checkCoordinateOnCircle (coordinate: Coordinate, circle: Omit<CircleAttrs, 'styles'>): boolean {
  const difX = coordinate.x - circle.x
  const difY = coordinate.y - circle.y
  const r = circle.r
  return !(difX * difX + difY * difY > r * r)
}

function drawCircle (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, isFill?: boolean): void {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.closePath()
  if (isFill ?? false) {
    ctx.fill()
  } else {
    ctx.stroke()
  }
}

export interface CircleStyle {
  fillColor: string | CanvasGradient
  stokeColor: string
  strokeSize: number
  style: 'fill' | 'stroke' | 'stroke-fill'
}

export interface CircleAttrs {
  x: number
  y: number
  r: number
  styles: CircleStyle
}

const circle: Figure<CircleAttrs> = {
  name: 'circle',
  checkEventOn: checkCoordinateOnCircle,
  draw: (ctx: CanvasRenderingContext2D, attrs: CircleAttrs) => {
    const { x, y, r, styles } = attrs
    ctx.strokeStyle = styles.stokeColor
    ctx.fillStyle = styles.fillColor
    ctx.lineWidth = styles.strokeSize
    if (styles.style === 'fill' || styles.style === 'stroke-fill') {
      drawCircle(ctx, x, y, r, true)
    }
    if (styles.style === 'stroke' || styles.style === 'stroke-fill') {
      drawCircle(ctx, x, y, r)
    }
  }
}

export default circle
