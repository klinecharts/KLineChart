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
import { AlignTextStyle } from '../../common/Styles'

import { createFont } from '../../common/utils/canvas'

import { Figure } from '../../componentl/Figure'

export function checkCoordinateOnText (coordinate: Coordinate, text: TextAttrs, styles: Partial<AlignTextStyle>): boolean {
  const { size = 12, align = 'left', baseline = 'top' } = styles
  const length = text.text.toString().length
  const width = size * length
  const height = size
  let startX: number
  switch (align) {
    case 'left':
    case 'start': {
      startX = coordinate.x
      break
    }
    case 'right':
    case 'end': {
      startX = coordinate.x - width
      break
    }
    default: {
      startX = coordinate.x - width / 2
      break
    }
  }
  let startY: number
  switch (baseline) {
    case 'top':
    case 'hanging': {
      startY = coordinate.y
      break
    }
    case 'bottom':
    case 'ideographic':
    case 'alphabetic': {
      startY = coordinate.y - height
      break
    }
    default: {
      startY = coordinate.y - height / 2
      break
    }
  }
  return (
    coordinate.x >= startX &&
    coordinate.x <= startX + width &&
    coordinate.y >= startY &&
    coordinate.y <= startY + height
  )
}

export function drawText (ctx: CanvasRenderingContext2D, attrs: TextAttrs, styles: Partial<AlignTextStyle>): void {
  const { x, y, text } = attrs
  const {
    color = 'currentColor',
    size = 12,
    family, weight,
    align = 'left',
    baseline = 'top'
  } = styles
  ctx.textAlign = align
  ctx.textBaseline = baseline
  ctx.font = createFont(size, weight, family)

  ctx.strokeStyle = color
  ctx.fillText(text, x, y)
}

export interface TextAttrs {
  x: number
  y: number
  text: any
}

const text: Figure<TextAttrs, Partial<AlignTextStyle>> = {
  name: 'text',
  checkEventOn: (coordinate: Coordinate, attrs: TextAttrs, styles: Partial<AlignTextStyle>) => {
    return checkCoordinateOnText(coordinate, attrs, styles)
  },
  draw: (ctx: CanvasRenderingContext2D, attrs: TextAttrs, styles: Partial<AlignTextStyle>) => {
    drawText(ctx, attrs, styles)
  }
}

export default text
