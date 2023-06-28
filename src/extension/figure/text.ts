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
import { TextStyle, RectTextStyle } from '../../common/Options'

import { createFont } from '../../common/utils/canvas'

import { FigureTemplate } from '../../component/Figure'

import { RectAttrs } from './rect'

export function getTextRect (attrs: TextAttrs, styles: Partial<RectTextStyle>, textWidth?: number): RectAttrs {
  const { size = 12, paddingLeft = 0, paddingTop = 0, paddingRight = 0, paddingBottom = 0 } = styles
  const { x, y, text, align = 'left', baseline = 'top' } = attrs
  const length = text.length
  textWidth = textWidth ?? size * length
  const textHeight = size
  let startX: number
  switch (align) {
    case 'left':
    case 'start': {
      startX = x
      break
    }
    case 'right':
    case 'end': {
      startX = x - paddingRight - textWidth - paddingLeft
      break
    }
    default: {
      startX = x - textWidth / 2 - paddingLeft
      break
    }
  }
  let startY: number
  switch (baseline) {
    case 'top':
    case 'hanging': {
      startY = y
      break
    }
    case 'bottom':
    case 'ideographic':
    case 'alphabetic': {
      startY = y - textHeight - paddingTop - paddingBottom
      break
    }
    default: {
      startY = y - textHeight / 2 - paddingTop
      break
    }
  }
  startX = Math.round(startX) + 0.5
  startY = Math.round(startY) + 0.5

  return { x: startX, y: startY, width: paddingLeft + textWidth + paddingRight, height: paddingTop + textHeight + paddingBottom }
}

export function checkCoordinateOnText (coordinate: Coordinate, attrs: TextAttrs, styles: Partial<RectTextStyle>): boolean {
  const { x, y, width, height } = getTextRect(attrs, styles)
  return (
    coordinate.x >= x &&
    coordinate.x <= x + width &&
    coordinate.y >= y &&
    coordinate.y <= y + height
  )
}

export function drawText (ctx: CanvasRenderingContext2D, attrs: TextAttrs, styles: Partial<TextStyle>): void {
  let { x, y, text, align = 'left', baseline = 'top' } = attrs
  const {
    color = 'currentColor',
    size = 12,
    family, weight
  } = styles
  ctx.textAlign = align
  ctx.textBaseline = baseline
  ctx.font = createFont(size, weight, family)

  x = Math.round(x) + 0.5
  y = Math.round(y) + 0.5

  ctx.fillStyle = color
  ctx.fillText(text, x, y)
}

export interface TextAttrs {
  x: number
  y: number
  text: string
  align?: CanvasTextAlign
  baseline?: CanvasTextBaseline
}

const text: FigureTemplate<TextAttrs, Partial<TextStyle>> = {
  name: 'text',
  checkEventOn: (coordinate: Coordinate, attrs: TextAttrs, styles: Partial<TextStyle>) => {
    return checkCoordinateOnText(coordinate, attrs, styles)
  },
  draw: (ctx: CanvasRenderingContext2D, attrs: TextAttrs, styles: Partial<TextStyle>) => {
    drawText(ctx, attrs, styles)
  }
}

export default text
