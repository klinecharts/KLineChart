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
 * 渲染填充菱形
 * @param ctx
 * @param color
 * @param centerCoordinate
 * @param width
 * @param height
 */
export function renderFillDiamond (ctx, color, centerCoordinate, width, height) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(centerCoordinate.x - width / 2, centerCoordinate.y)
  ctx.lineTo(centerCoordinate.x, centerCoordinate.y - height / 2)
  ctx.lineTo(centerCoordinate.x + width / 2, centerCoordinate.y)
  ctx.lineTo(centerCoordinate.x, centerCoordinate.y + height / 2)
  ctx.closePath()
  ctx.fill()
}
