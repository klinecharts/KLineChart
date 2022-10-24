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

function checkCoordinateOnPolygon (coordinate: Coordinate, polygon: Omit<PolygonAttrs, 'styles'>): boolean {
  let on = false
  const coordinates = polygon.coordinates
  for (let i = 0, j = coordinates.length - 1; i < coordinates.length; j = i++) {
    if (
      (coordinates[i].y > coordinate.y) !== (coordinates[j].y > coordinate.y) &&
      (coordinate.x < (coordinates[j].x - coordinates[i].x) * (coordinate.y - coordinates[i].y) / (coordinates[j].y - coordinates[i].y) + coordinates[i].x)
    ) {
      on = !on
    }
  }
  return on
}

function drawPolygon (ctx: CanvasRenderingContext2D, coordinates: Coordinate[], isFill?: boolean): void {
  ctx.beginPath()
  ctx.moveTo(coordinates[0].x, coordinates[0].y)
  for (let i = 1; i < coordinates.length; i++) {
    ctx.lineTo(coordinates[i].x, coordinates[i].y)
  }
  ctx.closePath()
  if (isFill ?? false) {
    ctx.fill()
  } else {
    ctx.stroke()
  }
}

export interface PolygonStyle {
  style: 'fill' | 'stroke' | 'stroke-fill'
  fillColor: string | CanvasGradient
  stokeColor: string
  strokeSize: number
}

export interface PolygonAttrs {
  coordinates: Coordinate[]
  styles: PolygonStyle
}

const polygon: Figure<PolygonAttrs> = {
  name: 'polygon',
  checkEventOn: checkCoordinateOnPolygon,
  draw: (ctx: CanvasRenderingContext2D, attrs: PolygonAttrs) => {
    const { coordinates, styles } = attrs
    ctx.strokeStyle = styles.stokeColor
    ctx.fillStyle = styles.fillColor
    ctx.lineWidth = styles.strokeSize
    if (styles.style === 'fill' || styles.style === 'stroke-fill') {
      drawPolygon(ctx, coordinates, true)
    }
    if (styles.style === 'stroke' || styles.style === 'stroke-fill') {
      drawPolygon(ctx, coordinates)
    }
  }
}

export default polygon
