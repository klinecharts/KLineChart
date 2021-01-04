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

import { checkPointOnStraightLine } from './graphicHelper'
import { formatPrecision } from '../../utils/format'
import { createFont } from '../../utils/canvas'

export default {
  name: 'fibonacciLine',
  series: 'twoPointLine',
  checkMousePointOnLine: (point1, point2, mousePoint) => {
    return checkPointOnStraightLine(point1, point2, mousePoint)
  },
  generatedLines: (xyPoints, viewport) => {
    const lines = []
    if (xyPoints.length > 0) {
      const startX = 0
      const endX = viewport.width
      lines.push([{ x: startX, y: xyPoints[0].y }, { x: endX, y: xyPoints[0].y }])
      if (xyPoints.length > 1) {
        const yDistance = xyPoints[0].y - xyPoints[1].y
        lines.push([{ x: startX, y: xyPoints[1].y + yDistance * 0.786 }, { x: endX, y: xyPoints[1].y + yDistance * 0.786 }])
        lines.push([{ x: startX, y: xyPoints[1].y + yDistance * 0.618 }, { x: endX, y: xyPoints[1].y + yDistance * 0.618 }])
        lines.push([{ x: startX, y: xyPoints[1].y + yDistance * 0.5 }, { x: endX, y: xyPoints[1].y + yDistance * 0.5 }])
        lines.push([{ x: startX, y: xyPoints[1].y + yDistance * 0.382 }, { x: endX, y: xyPoints[1].y + yDistance * 0.382 }])
        lines.push([{ x: startX, y: xyPoints[1].y + yDistance * 0.236 }, { x: endX, y: xyPoints[1].y + yDistance * 0.236 }])
        lines.push([{ x: startX, y: xyPoints[1].y }, { x: endX, y: xyPoints[1].y }])
      }
    }
    return lines
  },
  drawExtend: (ctx, lines, markOptions, precision, xAxis, yAxis) => {
    ctx.font = createFont(markOptions.text.size, markOptions.text.weight, markOptions.text.family)
    ctx.fillStyle = markOptions.text.color
    const percentTextArray = ['(100.0%)', '(78.6%)', '(61.8%)', '(50.0%)', '(38.2%)', '(23.6%)', '(0.0%)']
    lines.forEach((points, index) => {
      const point = points[0]
      const price = yAxis.convertFromPixel(point.y)
      const priceText = `${formatPrecision(price, precision.price)} ${percentTextArray[index]}`
      ctx.fillText(priceText, point.x + markOptions.text.marginLeft, point.y - markOptions.text.marginBottom)
    })
  }
}
