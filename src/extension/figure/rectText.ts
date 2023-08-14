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
import { RectTextStyle } from '../../common/Options'

import { createFont } from '../../common/utils/canvas'

import { FigureTemplate } from '../../component/Figure'

import { TextAttrs, getTextRect, drawText, checkCoordinateOnText } from './text'
import { drawRect } from './rect'

export function drawRectText (ctx: CanvasRenderingContext2D, attrs: TextAttrs, styles: Partial<RectTextStyle>): void {
  const { text } = attrs
  const {
    size = 12,
    family,
    weight,
    paddingLeft = 0,
    paddingTop = 0
  } = styles
  ctx.font = createFont(size, weight, family)
  const textWidth = ctx.measureText(text).width
  attrs.textWidth = textWidth
  const rect = getTextRect(attrs, styles, textWidth)
  drawRect(ctx, rect, { ...styles, color: styles.backgroundColor })
  drawText(ctx, { x: rect.x + paddingLeft, y: rect.y + paddingTop, text, align: 'left', baseline: 'top' }, styles)
}

const rectText: FigureTemplate<TextAttrs, Partial<RectTextStyle>> = {
  name: 'rectText',
  checkEventOn: (coordinate: Coordinate, attrs: TextAttrs, styles: Partial<RectTextStyle>) => {
    return checkCoordinateOnText(coordinate, attrs, styles)
  },
  draw: (ctx: CanvasRenderingContext2D, attrs: TextAttrs, styles: Partial<RectTextStyle>) => {
    drawRectText(ctx, attrs, styles)
  }
}

export default rectText
