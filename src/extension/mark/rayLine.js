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

import { checkPointOnRayLine, getLinearYFromPoints } from './graphicHelper'

export default {
  name: 'rayLine',
  totalStep: 3,
  checkMousePointOn: (type, points, mousePoint) => {
    return checkPointOnRayLine(points[0], points[1], mousePoint)
  },
  createGraphicDataSource: (step, tpPoints, xyPoints, viewport) => {
    let point = {
      x: xyPoints[0].x,
      y: 0
    }
    if (xyPoints.length === 2) {
      if (xyPoints[0].x === xyPoints[1].x && xyPoints[0].y !== xyPoints[1].y) {
        if (xyPoints[0].y < xyPoints[1].y) {
          point = {
            x: xyPoints[0].x,
            y: viewport.height
          }
        } else {
          point = {
            x: xyPoints[0].x,
            y: 0
          }
        }
      } else if (xyPoints[0].x > xyPoints[1].x) {
        point = {
          x: 0,
          y: getLinearYFromPoints(xyPoints[0], xyPoints[1], { x: 0, y: xyPoints[0].y })
        }
      } else {
        point = {
          x: viewport.width,
          y: getLinearYFromPoints(xyPoints[0], xyPoints[1], { x: viewport.width, y: xyPoints[0].y })
        }
      }
    }
    return [
      {
        type: 'line',
        isDraw: true,
        isCheck: true,
        dataSource: [[xyPoints[0], point]]
      }
    ]
  }
}
