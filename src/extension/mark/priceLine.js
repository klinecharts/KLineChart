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

import { checkPointOnRayLine } from './graphicHelper'
import { formatPrecision } from '../../utils/format'
import { createFont } from '../../utils/canvas'

export default {
  name: 'priceLine',
  series: 'onePointLine',
  checkMousePointOnLine: (point1, point2, mousePoint) => {
    return checkPointOnRayLine(point1, point2, mousePoint)
  },
  generatedLines: (xyPoints, viewport) => {
    return [
      [xyPoints[0], { x: viewport.width, y: xyPoints[0].y }]
    ]
  },
  drawExtend: (ctx, lines, markOptions, precision, xAxis, yAxis) => {
    const point = lines[0][0]
    const price = yAxis.convertFromPixel(point.y)
    const priceText = formatPrecision(price, precision.price)
    ctx.font = createFont(markOptions.text.size, markOptions.text.weight, markOptions.text.family)
    ctx.fillStyle = markOptions.text.color
    ctx.fillText(priceText, point.x + markOptions.text.marginLeft, point.y - markOptions.text.marginBottom)
  }
}
