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

import { renderPath } from './path'

/**
 * 绘制水平直线
 * @param ctx
 * @param y
 * @param left
 * @param right
 */
export function renderHorizontalLine (ctx, y, left, right) {
  ctx.beginPath()
  const correction = (ctx.lineWidth % 2) ? 0.5 : 0
  ctx.moveTo(left, y + correction)
  ctx.lineTo(right, y + correction)
  ctx.stroke()
  ctx.closePath()
}

/**
 * 绘制垂直直线
 * @param ctx
 * @param x
 * @param top
 * @param bottom
 */
export function renderVerticalLine (ctx, x, top, bottom) {
  ctx.beginPath()
  const correction = (ctx.lineWidth % 2) ? 0.5 : 0
  ctx.moveTo(x + correction, top)
  ctx.lineTo(x + correction, bottom)
  ctx.stroke()
  ctx.closePath()
}

/**
 * 绘制线
 * @param ctx
 * @param coordinates
 */
export function renderLine (ctx, coordinates) {
  renderPath(ctx, coordinates, () => {
    ctx.stroke()
    ctx.closePath()
  })
}
