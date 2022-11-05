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

import { createFont } from '../../common/utils/canvas'

import { Figure } from '../../componentl/Figure'

export function checkCoordinateOnText (coordinate: Coordinate, text: Omit<TextAttrs, 'styles'> & Pick<TextStyle, 'size' | 'align' | 'baseline'>): boolean {
  const length = text.text.toString().length
  const width = text.size * length
  const height = text.size
  let startX: number
  switch (text.align) {
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
  switch (text.baseline) {
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

export function drawText (ctx: CanvasRenderingContext2D, text: any, x: number, y: number, isFill?: boolean): void {
  if (isFill ?? false) {
    ctx.fillText(text, x, y)
  } else {
    ctx.strokeText(text, x, y)
  }
}

export interface TextStyle {
  style: 'fill' | 'stroke'
  color: string
  size: number
  family: string
  weight: number | string
  align: CanvasTextAlign
  baseline: CanvasTextBaseline
}

export interface TextAttrs {
  x: number
  y: number
  text: any
  styles: TextStyle
}

const text: Figure<TextAttrs> = {
  name: 'text',
  checkEventOn: (coordinate: Coordinate, attrs: TextAttrs) => {
    return checkCoordinateOnText(coordinate, { x: attrs.x, y: attrs.y, text: attrs.text, size: attrs.styles.size, align: attrs.styles.align, baseline: attrs.styles.baseline })
  },
  draw: (ctx: CanvasRenderingContext2D, attrs: TextAttrs) => {
    const { x, y, text, styles } = attrs
    ctx.textAlign = styles.align
    ctx.textBaseline = styles.baseline
    ctx.font = createFont(styles.size, styles.weight, styles.family)
    ctx.strokeStyle = styles.color
    ctx.fillStyle = styles.color
    drawText(ctx, text, x, y, styles.style === 'fill')
  }
}

export default text
