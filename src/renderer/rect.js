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

/**
 * 绘制带边框并填充的矩形
 * @param ctx
 * @param fillColor
 * @param borderColor
 * @param borderSize
 * @param x
 * @param y
 * @param width
 * @param height
 */
export function renderStrokeFillRect (
  ctx, fillColor, borderColor, borderSize,
  x, y, width, height
) {
  renderFillRect(ctx, fillColor, x, y, width, height)
  renderStrokeRect(ctx, borderColor, borderSize, x, y, width, height)
}

/**
 * @param ctx
 * @param fillColor
 * @param borderColor
 * @param borderSize
 * @param x
 * @param y
 * @param width
 * @param height
 * @param r
 */
export function renderStrokeFillRoundRect (
  ctx, fillColor, borderColor, borderSize,
  x, y, width, height, r
) {
  renderFillRoundRect(ctx, fillColor, x, y, width, height, r)
  renderStrokeRoundRect(ctx, borderColor, borderSize, x, y, width, height, r)
}

/**
 * 绘制空心矩形
 * @param ctx
 * @param borderColor
 * @param borderSize
 * @param x
 * @param y
 * @param width
 * @param height
 */
export function renderStrokeRect (ctx, borderColor, borderSize, x, y, width, height) {
  ctx.lineWidth = borderSize
  ctx.strokeStyle = borderColor
  ctx.strokeRect(x, y, width, height)
}

/**
 * 绘制填充的矩形
 * @param ctx
 * @param color
 * @param x
 * @param y
 * @param width
 * @param height
 */
export function renderFillRect (ctx, color, x, y, width, height) {
  ctx.fillStyle = color
  ctx.fillRect(x, y, width, height)
}

/**
 * 绘制填充的矩形
 * @param ctx
 * @param color
 * @param x
 * @param y
 * @param width
 * @param height
 * @param cornerWidth
 */
 export function renderFillRectWithCorner (ctx, color, x, y, width, height, cornerWidth) {
  ctx.fillStyle = color

  ctx.beginPath()
  ctx.moveTo(x, y + height / 2 + 0.5)
  ctx.lineTo(x + cornerWidth, y + 0.5)
  ctx.lineTo(x + cornerWidth, y + height + 0.5)
  ctx.closePath()
  ctx.fill()

  ctx.fillRect(x + cornerWidth, y, width, height)
}

/**
 * 绘制圆角空心矩形
 * @param ctx
 * @param borderColor
 * @param borderSize
 * @param x
 * @param y
 * @param w
 * @param h
 * @param r
 */
export function renderStrokeRoundRect (ctx, borderColor, borderSize, x, y, w, h, r) {
  ctx.lineWidth = borderSize
  ctx.strokeStyle = borderColor
  renderRoundRect(ctx, x, y, w, h, r)
  ctx.stroke()
}

/**
 * 绘制填充圆角矩形
 * @param ctx
 * @param color
 * @param x
 * @param y
 * @param w
 * @param h
 * @param r
 */
export function renderFillRoundRect (ctx, color, x, y, w, h, r) {
  ctx.fillStyle = color
  renderRoundRect(ctx, x, y, w, h, r)
  ctx.fill()
}

/**
 * 绘制圆角矩形
 * @param ctx
 * @param x
 * @param y
 * @param w
 * @param h
 * @param r
 */
export function renderRoundRect (ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export function roundRect(
  ctx,
  x,
  y,
  width,
  height,
  radius,
  fill,
  stroke,
) {
  if (typeof stroke === `undefined`) {
    stroke = true
  }
  if (typeof radius === `undefined`) {
    radius = 5
  }
  if (typeof radius === `number`) {
    radius = { tl: radius, tr: radius, br: radius, bl: radius }
  } else {
    const defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 }
    for (const side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side]
    }
  }
  ctx.beginPath()
  ctx.moveTo(x + radius.tl, y)
  ctx.lineTo(x + width - radius.tr, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
  ctx.lineTo(x + width, y + height - radius.br)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height)
  ctx.lineTo(x + radius.bl, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
  ctx.lineTo(x, y + radius.tl)
  ctx.quadraticCurveTo(x, y, x + radius.tl, y)
  ctx.closePath()
  if (fill) {
    ctx.fill()
  }
  if (stroke) {
    ctx.stroke()
  }
}
