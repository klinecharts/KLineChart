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
import { type TextStyle } from '../../common/Styles'

import { createFont, calcTextWidth } from '../../common/utils/canvas'

import { type FigureTemplate } from '../../component/Figure'

import { type RectAttrs, drawRect } from './rect'

export function getTextRect (attrs: TextAttrs, styles: Partial<TextStyle>): RectAttrs {
  const { size = 12, paddingLeft = 0, paddingTop = 0, paddingRight = 0, paddingBottom = 0, weight = 'normal', family } = styles
  const { x, y, text, align = 'left', baseline = 'top', width: w, height: h } = attrs
  const width = w ?? (paddingLeft + calcTextWidth(text, size, weight, family) + paddingRight)
  const height = h ?? (paddingTop + size + paddingBottom)
  let startX: number
  switch (align) {
    case 'left':
    case 'start': {
      startX = x
      break
    }
    case 'right':
    case 'end': {
      startX = x - width
      break
    }
    default: {
      startX = x - width / 2
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
      startY = y - height
      break
    }
    default: {
      startY = y - height / 2
      break
    }
  }
  return { x: startX, y: startY, width, height }
}

export function checkCoordinateOnText (coordinate: Coordinate, attrs: TextAttrs, styles: Partial<TextStyle>): boolean {
  const { x, y, width, height } = getTextRect(attrs, styles)
  return (
    coordinate.x >= x &&
    coordinate.x <= x + width &&
    coordinate.y >= y &&
    coordinate.y <= y + height
  )
}

export function drawText (ctx: CanvasRenderingContext2D, attrs: TextAttrs, styles: Partial<TextStyle>): void {
  const { text } = attrs
  const {
    color = 'currentColor',
    size = 12,
    family,
    weight,
    paddingLeft = 0,
    paddingTop = 0,
    paddingRight = 0
  } = styles
  const rect = getTextRect(attrs, styles)

  drawRect(ctx, rect, { ...styles, color: styles.backgroundColor })

  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.font = createFont(size, weight, family)
  ctx.fillStyle = color
  ctx.fillText(text, rect.x + paddingLeft, rect.y + paddingTop, rect.width - paddingLeft - paddingRight)
}

export interface TextAttrs {
  x: number
  y: number
  text: string
  width?: number
  height?: number
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
