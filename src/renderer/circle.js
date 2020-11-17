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
 * 绘制带边框的填充圆
 * @param ctx
 * @param fillColor
 * @param borderColor
 * @param borderSize
 * @param circlePoint
 * @param radius
 */
export function renderStrokeFillCircle (ctx, fillColor, borderColor, borderSize, circlePoint, radius) {
  renderFillCircle(ctx, fillColor, circlePoint, radius)
  renderStrokeCircle(ctx, borderColor, borderSize, circlePoint, radius)
}

/**
 * 绘制边框圆
 * @param ctx
 * @param borderColor
 * @param borderSize
 * @param circlePoint
 * @param radius
 */
export function renderStrokeCircle (ctx, borderColor, borderSize, circlePoint, radius) {
  ctx.lineWidth = borderSize
  ctx.strokeStyle = borderColor
  ctx.beginPath()
  ctx.arc(circlePoint.x, circlePoint.y, radius, 0, Math.PI * 2)
  ctx.closePath()
  ctx.stroke()
}

/**
 * 绘制实心圆
 * @param ctx
 * @param fillColor
 * @param circlePoint
 * @param radius
 */
export function renderFillCircle (ctx, fillColor, circlePoint, radius) {
  ctx.fillStyle = fillColor
  ctx.beginPath()
  ctx.arc(circlePoint.x, circlePoint.y, radius, 0, Math.PI * 2)
  ctx.closePath()
  ctx.fill()
}
