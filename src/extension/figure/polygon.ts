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

export function checkCoordinateOnPolygon (coordinate: Coordinate, attrs: PolygonAttrs | PolygonAttrs[]): boolean {
  let polygons: PolygonAttrs[] = []
  polygons = polygons.concat(attrs)
  for (let i = 0; i < polygons.length; i++) {
    let on = false
    const { coordinates } = polygons[i]
    for (let i = 0, j = coordinates.length - 1; i < coordinates.length; j = i++) {
      if (
        (coordinates[i].y > coordinate.y) !== (coordinates[j].y > coordinate.y) &&
        (coordinate.x < (coordinates[j].x - coordinates[i].x) * (coordinate.y - coordinates[i].y) / (coordinates[j].y - coordinates[i].y) + coordinates[i].x)
      ) {
        on = !on
      }
    }
    if (on) {
      return true
    }
  }
  return false
}

export function drawPolygon (ctx: CanvasRenderingContext2D, attrs: PolygonAttrs | PolygonAttrs[], styles: Partial<PolygonStyle>): void {
  let polygons: PolygonAttrs[] = []
  polygons = polygons.concat(attrs)
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
    (!isString(color) || !isTransparent(color))) {
    ctx.fillStyle = color
    polygons.forEach(({ coordinates }) => {
      ctx.beginPath()
      ctx.moveTo(coordinates[0].x, coordinates[0].y)
      for (let i = 1; i < coordinates.length; i++) {
        ctx.lineTo(coordinates[i].x, coordinates[i].y)
      }
      ctx.closePath()
      ctx.fill()
    })
  }
  if ((style === PolygonType.Stroke || styles.style === PolygonType.StrokeFill) && borderSize > 0 && !isTransparent(borderColor)) {
    ctx.strokeStyle = borderColor
    ctx.lineWidth = borderSize
    if (borderStyle === LineType.Dashed) {
      ctx.setLineDash(borderDashedValue)
    } else {
      ctx.setLineDash([])
    }
    polygons.forEach(({ coordinates }) => {
      ctx.beginPath()
      ctx.moveTo(coordinates[0].x, coordinates[0].y)
      for (let i = 1; i < coordinates.length; i++) {
        ctx.lineTo(coordinates[i].x, coordinates[i].y)
      }
      ctx.closePath()
      ctx.stroke()
    })
  }
}

export interface PolygonAttrs {
  coordinates: Coordinate[]
}

const polygon: FigureTemplate<PolygonAttrs | PolygonAttrs[], Partial<PolygonStyle>> = {
  name: 'polygon',
  checkEventOn: checkCoordinateOnPolygon,
  draw: (ctx: CanvasRenderingContext2D, attrs: PolygonAttrs | PolygonAttrs[], styles: Partial<PolygonStyle>) => {
    drawPolygon(ctx, attrs, styles)
  }
}

export default polygon
