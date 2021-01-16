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

import { checkPointOnStraightLine, getLinearYFromPoints } from './graphicHelper'

export default {
  name: 'straightLine',
  totalStep: 3,
  checkMousePointOn: (key, type, points, mousePoint) => {
    return checkPointOnStraightLine(points[0], points[1], mousePoint)
  },
  createGraphicDataSource: (step, tpPoints, xyPoints, viewport) => {
    if (xyPoints.length < 2 || xyPoints[0].x === xyPoints[1].x) {
      return [
        {
          type: 'line',
          isDraw: true,
          isCheck: true,
          dataSource: [[
            {
              x: xyPoints[0].x,
              y: 0
            }, {
              x: xyPoints[0].x,
              y: viewport.height
            }
          ]]
        }
      ]
    }
    return [
      {
        type: 'line',
        isDraw: true,
        isCheck: true,
        dataSource: [[
          {
            x: 0,
            y: getLinearYFromPoints(xyPoints[0], xyPoints[1], { x: 0, y: xyPoints[0].y })
          }, {
            x: viewport.width,
            y: getLinearYFromPoints(xyPoints[0], xyPoints[1], { x: viewport.width, y: xyPoints[0].y })
          }
        ]]
      }
    ]
  }
}
