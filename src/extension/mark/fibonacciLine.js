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
  checkMousePointOn: (key, type, coordinates, mouseCoordinate) => {
    return checkPointOnStraightLine(coordinates[0], coordinates[1], mouseCoordinate)
  },
  createGraphicDataSource: (step, points, coordinates, viewport, precision) => {
    if (coordinates.length > 0) {
      const lines = []
      const texts = []
      const startX = 0
      const endX = viewport.width
      if (coordinates.length > 1) {
        const percents = [1, 0.786, 0.618, 0.5, 0.382, 0.236, 0]
        const yDif = coordinates[0].y - coordinates[1].y
        const valueDif = points[0].value - points[1].value
        percents.forEach(percent => {
          const y = coordinates[1].y + yDif * percent
          const value = (points[1].value + valueDif * percent).toFixed(precision.price)
          lines.push([{ x: startX, y }, { x: endX, y }])
          texts.push({
            x: startX,
            y,
            text: `${value} (${(percent * 100).toFixed(1)}%)`
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
