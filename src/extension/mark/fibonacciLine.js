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
  checkMousePointOn: (key, type, points, mousePoint) => {
    return checkPointOnStraightLine(points[0], points[1], mousePoint)
  },
  createGraphicDataSource: (step, tpPoints, xyPoints, viewport, precision) => {
    if (xyPoints.length > 0) {
      //const lines = []
      const texts = []
     // const startX = 0
      const endX = viewport.width
      if (xyPoints.length > 1) {
        var lines = [
          [
            {
              x: xyPoints[0].x,
              y: xyPoints[0].y
            }, {
              x: xyPoints[1].x,
              y: xyPoints[1].y
            }
          ]
         ]
        const percents = [1, 0.786, 0.618, 0.5, 0.382, 0.236, 0]
        const yDif = xyPoints[0].y - xyPoints[1].y
        const priceDif = tpPoints[0].price - tpPoints[1].price
        percents.forEach(percent => {
          const y = xyPoints[1].y + yDif * percent
          const price = (tpPoints[1].price + priceDif * percent).toFixed(precision.price)
          lines.push([{  x: xyPoints[1].x, y }, { x: endX, y }])
          texts.push({
            x: xyPoints[1].x,
            y,
            text: `${price} (${(percent * 100).toFixed(1)}%)`
          })
        })
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
    return []
  }
}
