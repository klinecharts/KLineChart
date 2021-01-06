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

export default {
  name: 'fibonacciLine',
  totalStep: 3,
  checkMousePointOn: (type, points, mousePoint) => {
    return checkPointOnStraightLine(points[0], points[1], mousePoint)
  },
  createGraphicDataSource: (step, tpPoints, xyPoints, viewport, precision, xAxis, yAxis) => {
    const lines = []
    const texts = []
    if (xyPoints.length > 0) {
      const startX = 0
      const endX = viewport.width
      lines.push([{ x: startX, y: xyPoints[0].y }, { x: endX, y: xyPoints[0].y }])
      texts.push({
        x: startX,
        y: xyPoints[0].y,
        text: `${yAxis.convertFromPixel(xyPoints[0].y).toFixed(precision.price)} (100%)`
      })
      if (xyPoints.length > 1) {
        const percents = [0.786, 0.618, 0.5, 0.382, 0.236, 0]
        const yDistance = xyPoints[0].y - xyPoints[1].y
        percents.forEach(percent => {
          const y = xyPoints[1].y + yDistance * percent
          lines.push([{ x: startX, y }, { x: endX, y }])
          texts.push({
            x: startX,
            y,
            text: `${yAxis.convertFromPixel(y).toFixed(precision.price)} (${(percent * 100).toFixed(1)}%)`
          })
        })
      }
    }
    return [
      {
        type: 'line',
        isDraw: true,
        isCheck: true,
        dataSource: lines
      }, {
        type: 'text',
        isDraw: true,
        isCheck: false,
        dataSource: texts
      }
    ]
  }
}
