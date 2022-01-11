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
 * 绘制路径
 * @param ctx
 * @param coordinates
 * @param strokeFill
 */
export function renderPath (ctx, coordinates, strokeFill) {
  ctx.save()
  if (ctx.lineWidth % 2) {
    ctx.translate(0.5, 0.5)
  }
  ctx.beginPath()
  let move = true
  coordinates.forEach(coordinate => {
    if (coordinate) {
      if (move) {
        ctx.moveTo(coordinate.x, coordinate.y)
        move = false
      } else {
        ctx.lineTo(coordinate.x, coordinate.y)
      }
    }
  })
  strokeFill()
  ctx.restore()
}

export function renderCloseStrokePath (ctx, coordinates) {
  renderPath(ctx, coordinates, () => {
    ctx.closePath()
    ctx.stroke()
  })
}

/**
 * 渲染填充路径
 * @param ctx
 * @param coordinates
 */
export function renderCloseFillPath (ctx, coordinates) {
  renderPath(ctx, coordinates, () => {
    ctx.closePath()
    ctx.fill()
  })
}
