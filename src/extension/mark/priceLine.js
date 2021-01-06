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

export default {
  name: 'priceLine',
  totalStep: 2,
  checkMousePointOn: (type, points, mousePoint) => {
    return checkPointOnRayLine(points[0], points[1], mousePoint)
  },
  createGraphicDataSource: (step, tpPoints, xyPoints, viewport, precision, xAxis, yAxis) => {
    return [
      {
        type: 'line',
        isDraw: true,
        isCheck: true,
        dataSource: [[xyPoints[0], { x: viewport.width, y: xyPoints[0].y }]]
      },
      {
        type: 'text',
        isDraw: true,
        isCheck: false,
        dataSource: [
          { x: xyPoints[0].x, y: xyPoints[0].y, text: yAxis.convertFromPixel(xyPoints[0].y).toFixed(precision.price) }
        ]
      }
    ]
  }
}
