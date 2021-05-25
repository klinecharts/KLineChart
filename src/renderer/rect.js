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
 * 绘制带边框的圆角填充矩形
 * @param ctx
 * @param fillColor
 * @param borderColor
 * @param borderSize
 * @param x
 * @param y
 * @param width
 * @param height
 * @param borderRadius
 */
export function renderStrokeFillRoundRect (
  ctx, fillColor, borderColor, borderSize,
  x, y, width, height, borderRadius
) {
  renderFillRoundRect(ctx, fillColor, x, y, width, height, borderRadius)
  renderStrokeRoundRect(ctx, borderColor, borderSize, x, y, width, height, borderRadius)
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
